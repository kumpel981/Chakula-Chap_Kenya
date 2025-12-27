// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "chakulachap-kenya.firebaseapp.com",
    projectId: "chakulachap-kenya",
    storageBucket: "chakulachap-kenya.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const analytics = firebase.analytics();

// Firebase Collections
const COLLECTIONS = {
    USERS: 'users',
    CAMPUSES: 'campuses',
    MEALS: 'meals',
    VENDORS: 'vendors',
    ORDERS: 'orders',
    REVIEWS: 'reviews',
    TRANSACTIONS: 'transactions',
    WHATSAPP_LOGS: 'whatsapp_logs',
    ADMIN_LOGS: 'admin_logs'
};

// Initialize database structure
async function initDatabase() {
    try {
        // Check if data exists
        const campusesRef = db.collection(COLLECTIONS.CAMPUSES);
        const snapshot = await campusesRef.limit(1).get();
        
        if (snapshot.empty) {
            await seedInitialData();
            console.log('Database seeded with initial data');
        }
        
        console.log('Firebase initialized successfully');
    } catch (error) {
        console.error('Firebase init error:', error);
    }
}

// Seed initial data
async function seedInitialData() {
    // Campuses data
    const campuses = [
        {
            id: 'uo_nairobi',
            name: 'University of Nairobi',
            location: { lat: -1.2921, lng: 36.8219 },
            address: 'Nairobi CBD',
            description: 'Main campus with multiple dining options',
            status: 'active',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            stats: {
                totalMeals: 25,
                totalVendors: 12,
                avgPrice: 85,
                totalStudents: 15000,
                rating: 4.2
            }
        },
        {
            id: 'ku',
            name: 'Kenyatta University',
            location: { lat: -1.1805, lng: 36.9243 },
            address: 'Kahawa, Nairobi',
            description: 'Large campus with diverse food options',
            status: 'active',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            stats: {
                totalMeals: 18,
                totalVendors: 8,
                avgPrice: 110,
                totalStudents: 12000,
                rating: 4.0
            }
        }
    ];

    // Add campuses
    for (const campus of campuses) {
        await db.collection(COLLECTIONS.CAMPUSES).doc(campus.id).set(campus);
        
        // Add sample meals for each campus
        const meals = getSampleMeals(campus.id);
        for (const meal of meals) {
            await db.collection(COLLECTIONS.MEALS).doc(meal.id).set(meal);
        }
    }
}

function getSampleMeals(campusId) {
    const baseMeals = [
        {
            id: `${campusId}_githeri`,
            name: 'Githeri Special',
            campusId: campusId,
            price: 70,
            vendor: 'Main Cafeteria',
            location: 'Central Campus',
            description: 'Traditional mix of maize and beans',
            healthScore: 4,
            calories: 350,
            tags: ['vegetarian', 'local', 'healthy'],
            rating: 4.5,
            totalReviews: 45,
            available: true,
            preparationTime: 15,
            imageUrl: '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        },
        {
            id: `${campusId}_chapati_beans`,
            name: 'Chapati + Beans',
            campusId: campusId,
            price: 60,
            vendor: 'Hostel Kiosk',
            location: 'Hostel Zone',
            description: 'Fresh chapati with well-cooked beans',
            healthScore: 4,
            calories: 450,
            tags: ['vegetarian', 'local'],
            rating: 4.2,
            totalReviews: 38,
            available: true,
            preparationTime: 10,
            imageUrl: '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }
    ];
    
    return baseMeals;
}

// User authentication
async function signUp(email, password, userData) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Save user data to Firestore
        await db.collection(COLLECTIONS.USERS).doc(user.uid).set({
            ...userData,
            uid: user.uid,
            email: user.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            role: 'student',
            status: 'active'
        });
        
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Firebase Services
class FirebaseService {
    // Campus operations
    static async getCampuses() {
        const snapshot = await db.collection(COLLECTIONS.CAMPUSES)
            .where('status', '==', 'active')
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    static async getCampusById(campusId) {
        const doc = await db.collection(COLLECTIONS.CAMPUSES).doc(campusId).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
    }

    // Meal operations
    static async getMealsByCampus(campusId, budget = null) {
        let query = db.collection(COLLECTIONS.MEALS)
            .where('campusId', '==', campusId)
            .where('available', '==', true);
        
        if (budget) {
            query = query.where('price', '<=', budget);
        }
        
        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    static async addMeal(mealData) {
        const mealId = `${mealData.campusId}_${Date.now()}`;
        await db.collection(COLLECTIONS.MEALS).doc(mealId).set({
            ...mealData,
            id: mealId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return mealId;
    }

    // User operations
    static async getUserProfile(uid) {
        const doc = await db.collection(COLLECTIONS.USERS).doc(uid).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
    }

    static async updateUserProfile(uid, data) {
        await db.collection(COLLECTIONS.USERS).doc(uid).update({
            ...data,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    // Analytics
    static async logSearch(campusId, budget, userId = null) {
        await db.collection('analytics').add({
            type: 'search',
            campusId,
            budget,
            userId,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userAgent: navigator.userAgent
        });
    }

    static async logWhatsAppMessage(phone, message, response) {
        await db.collection(COLLECTIONS.WHATSAPP_LOGS).add({
            phone,
            message,
            response,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    // Admin operations
    static async getAdminStats() {
        const [
            campusesSnapshot,
            mealsSnapshot,
            usersSnapshot,
            logsSnapshot
        ] = await Promise.all([
            db.collection(COLLECTIONS.CAMPUSES).count().get(),
            db.collection(COLLECTIONS.MEALS).count().get(),
            db.collection(COLLECTIONS.USERS).count().get(),
            db.collection(COLLECTIONS.WHATSAPP_LOGS)
                .orderBy('timestamp', 'desc')
                .limit(100)
                .get()
        ]);

        return {
            totalCampuses: campusesSnapshot.data().count,
            totalMeals: mealsSnapshot.data().count,
            totalUsers: usersSnapshot.data().count,
            recentLogs: logsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        };
    }
}

// Export for use in other files
window.firebaseService = FirebaseService;
window.firebaseAuth = auth;
window.firebaseDb = db;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Add Firebase SDKs if not already loaded
    if (typeof firebase === 'undefined') {
        await loadFirebaseScripts();
    }
    
    await initDatabase();
    
    // Listen for auth state changes
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('User signed in:', user.email);
            // Update UI for logged in user
        } else {
            console.log('No user signed in');
        }
    });
});

async function loadFirebaseScripts() {
    const scripts = [
        'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',
        'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js',
        'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js',
        'https://www.gstatic.com/firebasejs/9.22.0/firebase-storage-compat.js',
        'https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics-compat.js'
    ];

    for (const src of scripts) {
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
}
