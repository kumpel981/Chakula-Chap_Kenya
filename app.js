// ChakulaChap Kenya - Main Application
// Professional Meal Finder for Kenyan University Students

class ChakulaChapApp {
    constructor() {
        this.currentCampus = 'uo_nairobi';
        this.currentBudget = 150;
        this.campuses = {};
        this.survivalTips = [];
        this.weeklyPlans = {};
        this.isLoading = false;
        
        this.init();
    }

    async init() {
        // Load data
        await this.loadData();
        
        // Initialize UI
        this.initUI();
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Initialize PWA
        this.initPWA();
        
        // Show initial data
        this.renderCampuses();
        this.updateUI();
    }

    async loadData() {
        try {
            // In production, this would fetch from an API
            // For now, use embedded data
            this.campuses = {
                'uo_nairobi': {
                    id: 'uo_nairobi',
                    name: 'University of Nairobi',
                    icon: '🏛️',
                    color: '#FF6B35',
                    location: 'Nairobi CBD',
                    description: 'Main campus with multiple dining options',
                    meals: [
                        { id: 'githeri_uon', name: 'Githeri Special', price: 70, vendor: 'Main Cafeteria', location: 'Central Campus', health: 4, calories: 350, tip: 'Add avocado for healthy fats', rating: 4.2, tags: ['vegetarian', 'local'] },
                        { id: 'ugali_sukuma', name: 'Ugali + Sukuma Wiki', price: 80, vendor: 'Main Cafeteria', location: 'Central Campus', health: 4, calories: 400, tip: 'Comes with free soup on Wednesdays', rating: 4.0, tags: ['local', 'vegetarian'] },
                        { id: 'chapati_beans', name: 'Chapati + Beans', price: 60, vendor: 'Mama Nia\'s Kiosk', location: 'Hostel B', health: 4, calories: 450, tip: 'Perfect protein-carb combo', rating: 4.5, tags: ['vegetarian', 'popular'] },
                        { id: 'chips_sausage', name: 'Chips + Sausage', price: 150, vendor: 'Taifa Food Court', location: 'Student Centre', health: 2, calories: 600, tip: 'Add kachumbari for vitamins', rating: 3.8, tags: ['fast-food'] },
                        { id: 'rice_beef', name: 'Rice + Beef Stew', price: 180, vendor: 'Taifa Food Court', location: 'Student Centre', health: 3, calories: 550, tip: 'Portion is large enough to share', rating: 4.1, tags: ['meat', 'filling'] },
                        { id: 'fruit_salad', name: 'Fruit Salad', price: 100, vendor: 'Student Centre', location: 'Food Court', health: 5, calories: 200, tip: 'Best for digestion after heavy meals', rating: 4.3, tags: ['healthy', 'vegetarian'] },
                        { id: 'mandazi_tea', name: 'Mandazi + Tea', price: 30, vendor: 'Hostel Kiosk', location: 'Hostel Zone', health: 2, calories: 250, tip: 'Best value breakfast option', rating: 3.5, tags: ['breakfast', 'budget'] }
                    ],
                    vendors: [
                        { name: 'Main Cafeteria', type: 'cafeteria', budget: 'low', hours: '7AM-7PM' },
                        { name: 'Taifa Food Court', type: 'food-court', budget: 'medium', hours: '8AM-9PM' },
                        { name: 'Mama Nia\'s Kiosk', type: 'kiosk', budget: 'low', hours: '6AM-10PM' }
                    ],
                    stats: { meals: 25, avgPrice: 85, students: 1500 }
                },
                'ku': {
                    id: 'ku',
                    name: 'Kenyatta University',
                    icon: '🎓',
                    color: '#1A73E8',
                    location: 'Kahawa, Nairobi',
                    description: 'Large campus with diverse food options',
                    meals: [
                        { id: 'rice_beans_ku', name: 'Rice + Beans', price: 60, vendor: 'KU Main Mess', location: 'Near Hall 7', health: 4, calories: 400, tip: 'Mix with avocado for creaminess', rating: 4.0, tags: ['vegetarian', 'local'] },
                        { id: 'ugali_beef_ku', name: 'Ugali + Beef', price: 120, vendor: 'KU Main Mess', location: 'Near Hall 7', health: 3, calories: 500, tip: 'Double portion available for Ksh 180', rating: 4.2, tags: ['meat', 'filling'] },
                        { id: 'spaghetti_ku', name: 'Spaghetti', price: 80, vendor: 'KU Main Mess', location: 'Near Hall 7', health: 3, calories: 450, tip: 'Add boiled egg for complete meal', rating: 3.9, tags: ['student-favorite'] },
                        { id: 'chicken_burger_ku', name: 'Chicken Burger', price: 200, vendor: 'Bamboo Cafe', location: 'Commerce Building', health: 3, calories: 500, tip: 'Comes with free soda on Fridays', rating: 4.3, tags: ['fast-food'] },
                        { id: 'vegetable_stew_ku', name: 'Vegetable Stew', price: 90, vendor: 'Green Cafe', location: 'Near Library', health: 5, calories: 300, tip: 'Best vegetarian option on campus', rating: 4.5, tags: ['healthy', 'vegetarian'] }
                    ],
                    vendors: [
                        { name: 'KU Main Mess', type: 'mess', budget: 'low', hours: '6:30AM-8PM' },
                        { name: 'Bamboo Cafe', type: 'cafe', budget: 'medium', hours: '8AM-10PM' },
                        { name: 'Green Cafe', type: 'cafe', budget: 'medium', hours: '9AM-9PM' }
                    ],
                    stats: { meals: 18, avgPrice: 110, students: 1200 }
                },
                'jkuat': {
                    id: 'jkuat',
                    name: 'JKUAT (Juja)',
                    icon: '🔬',
                    color: '#9B59B6',
                    location: 'Juja, Kiambu',
                    description: 'Technical university with affordable options',
                    meals: [
                        { id: 'githeri_jkuat', name: 'Githeri Special', price: 70, vendor: 'Main Gate', location: 'Main Gate', health: 4, calories: 400, tip: 'Comes with free avocado on Tuesdays', rating: 4.4, tags: ['vegetarian', 'local'] },
                        { id: 'chapati_minji', name: 'Chapati + Minji', price: 80, vendor: 'Hostel Zone', location: 'Hostel Area', health: 4, calories: 450, tip: 'Hearty and filling meal', rating: 4.2, tags: ['vegetarian', 'popular'] },
                        { id: 'pizza_jkuat', name: 'Pizza Slice', price: 150, vendor: 'Food Court', location: 'Student Centre', health: 2, calories: 350, tip: 'Add salad for balanced meal', rating: 3.7, tags: ['fast-food'] }
                    ],
                    vendors: [
                        { name: 'Main Gate Vendors', type: 'street-food', budget: 'low', hours: '6AM-11PM' },
                        { name: 'Food Court', type: 'food-court', budget: 'medium', hours: '9AM-10PM' }
                    ],
                    stats: { meals: 12, avgPrice: 100, students: 800 }
                },
                'moi': {
                    id: 'moi',
                    name: 'Moi University',
                    icon: '🌳',
                    color: '#27AE60',
                    location: 'Eldoret',
                    description: 'Large campus with traditional options',
                    meals: [
                        { id: 'ugali_fish', name: 'Ugali + Fish', price: 140, vendor: 'Main Cafeteria', location: 'Central', health: 4, calories: 450, tip: 'Omega-3 rich option', rating: 4.3, tags: ['seafood', 'healthy'] },
                        { id: 'rice_chicken', name: 'Rice + Chicken', price: 160, vendor: 'Food Court', location: 'Student Centre', health: 3, calories: 500, tip: 'Popular Wednesday special', rating: 4.1, tags: ['meat', 'popular'] }
                    ],
                    stats: { meals: 15, avgPrice: 120, students: 900 }
                },
                'egerton': {
                    id: 'egerton',
                    name: 'Egerton University',
                    icon: '🌾',
                    color: '#F39C12',
                    location: 'Njoro, Nakuru',
                    description: 'Agricultural university with fresh options',
                    meals: [
                        { id: 'githeri_avocado', name: 'Githeri + Avocado', price: 90, vendor: 'Njoro Cafe', location: 'Main Campus', health: 5, calories: 420, tip: 'Farm-fresh ingredients', rating: 4.6, tags: ['vegetarian', 'healthy'] }
                    ],
                    stats: { meals: 10, avgPrice: 95, students: 600 }
                }
            };

            this.survivalTips = [
                "🍌 Buy bananas - cheapest fruit at Ksh 5-10 each! Eat 2 for instant energy.",
                "💧 Drink 2 glasses of water before meals - you'll feel fuller and eat less.",
                "👥 Team up with 3 friends: Buy 1kg rice (Ksh 120), 1kg beans (Ksh 180), cooking oil, tomatoes, onions = Ksh 400 total (Ksh 100 each) for 3 days of meals!",
                "🥚 Boil 6 eggs on Sunday night - keep them for snacks throughout the week!",
                "🛒 Visit mama mboga at 6 PM - prices drop as they close for the day!",
                "🍞 Buy unripe bananas (ndizi) - they last longer and can be boiled, fried, or roasted!",
                "🔥 Learn to make uji (porridge) - nutritious breakfast for Ksh 15 per serving!",
                "📅 Plan weekly meals: Sunday cooking saves time and money all week!"
            ];

            this.weeklyPlans = {
                500: [
                    "Monday: Githeri (50) + Banana (20) = Ksh 70",
                    "Tuesday: Ugali Sukuma (70) + Orange (15) = Ksh 85",
                    "Wednesday: Chapati Beans (60) + Spinach (10) = Ksh 70",
                    "Thursday: Rice Beans (60) + Tomato (10) = Ksh 70",
                    "Friday: Githeri (50) + Avocado (30) = Ksh 80",
                    "Saturday: DIY pasta with tomato (80) = Ksh 80",
                    "Sunday: Treat day - Chips (100) = Ksh 100",
                    "TOTAL: Ksh 555 (extra Ksh 55 for emergencies!)"
                ],
                1000: [
                    "Monday: Rice + Beef (160) + Fruit (30) = Ksh 190",
                    "Tuesday: Chapati + Minji (80) + Salad (40) = Ksh 120",
                    "Wednesday: Spaghetti + Egg (100) + Fruit (30) = Ksh 130",
                    "Thursday: Githeri + Avocado (70) + Yogurt (50) = Ksh 120",
                    "Friday: Chicken Burger (200) - treat yourself! = Ksh 200",
                    "Saturday: DIY cooking with friends = Ksh 120",
                    "Sunday: Vegetable stew + 2 chapati (90) = Ksh 90",
                    "TOTAL: Ksh 970 (save Ksh 30 for snacks!)"
                ]
            };

            console.log('Data loaded successfully');
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    initUI() {
        // Set initial budget display
        document.getElementById('budgetAmount').textContent = this.currentBudget;
        document.getElementById('budgetSlider').value = this.currentBudget;
        
        // Set initial campus
        this.selectCampus(this.currentCampus);
    }

    initEventListeners() {
        // Campus selection
        document.getElementById('campusGrid').addEventListener('click', (e) => {
            const campusCard = e.target.closest('.campus-card');
            if (campusCard && campusCard.dataset.campus) {
                this.selectCampus(campusCard.dataset.campus);
            }
        });

        // Budget slider
        const budgetSlider = document.getElementById('budgetSlider');
        budgetSlider.addEventListener('input', (e) => {
            this.currentBudget = parseInt(e.target.value);
            document.getElementById('budgetAmount').textContent = this.currentBudget;
            this.updateBudgetPresets();
        });

        // Budget presets
        document.querySelectorAll('.budget-preset').forEach(preset => {
            preset.addEventListener('click', (e) => {
                const budget = parseInt(e.target.dataset.budget);
                this.currentBudget = budget;
                document.getElementById('budgetAmount').textContent = budget;
                budgetSlider.value = budget;
                this.updateBudgetPresets();
            });
        });

        // Find meals button
        document.getElementById('findMealsBtn').addEventListener('click', () => {
            this.findMeals();
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Mobile menu
        document.querySelector('.mobile-menu-btn').addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Back to top
        const backToTop = document.getElementById('backToTop');
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Campus links in footer
        document.querySelectorAll('[data-campus]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const campusId = e.target.dataset.campus;
                this.selectCampus(campusId);
                document.querySelector('#find').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    initPWA() {
        // Check if PWA is installable
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
        });
    }

    renderCampuses() {
        const campusGrid = document.getElementById('campusGrid');
        const campusesGrid = document.getElementById('campusesGrid');
        
        campusGrid.innerHTML = '';
        campusesGrid.innerHTML = '';
        
        Object.values(this.campuses).forEach(campus => {
            // Campus selector cards
            const campusCard = document.createElement('div');
            campusCard.className = `campus-card ${campus.id === this.currentCampus ? 'active' : ''}`;
            campusCard.dataset.campus = campus.id;
            campusCard.innerHTML = `
                <div class="campus-icon">${campus.icon}</div>
                <div class="campus-name">${campus.name}</div>
                <div class="campus-meals">${campus.meals.length} meal options</div>
            `;
            campusGrid.appendChild(campusCard);
            
            // Campus feature cards
            const campusFeatureCard = document.createElement('div');
            campusFeatureCard.className = 'campus-feature-card';
            campusFeatureCard.innerHTML = `
                <div class="campus-feature-header">
                    <div class="campus-feature-icon">${campus.icon}</div>
                    <div>
                        <h3 class="campus-feature-title">${campus.name}</h3>
                        <p style="color: var(--gray-600); font-size: 0.875rem;">${campus.location}</p>
                    </div>
                </div>
                <p style="margin-bottom: var(--space-lg);">${campus.description}</p>
                <div class="campus-feature-stats">
                    <div class="stat-item">
                        <div class="stat-value">${campus.stats.meals}</div>
                        <div class="stat-label">Meals</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">KES ${campus.stats.avgPrice}</div>
                        <div class="stat-label">Avg Price</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${campus.stats.students}</div>
                        <div class="stat-label">Students</div>
                    </div>
                </div>
                <div class="campus-feature-meals">
                    <h4 style="margin-bottom: var(--space-md); font-size: 1rem;">Popular Meals</h4>
                    ${campus.meals.slice(0, 3).map(meal => `
                        <div class="meal-item">
                            <span class="meal-item-name">${meal.name}</span>
                            <span class="meal-item-price">KES ${meal.price}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            campusesGrid.appendChild(campusFeatureCard);
        });
    }

    selectCampus(campusId) {
        if (!this.campuses[campusId]) return;
        
        this.currentCampus = campusId;
        
        // Update UI
        document.querySelectorAll('.campus-card').forEach(card => {
            card.classList.remove('active');
            if (card.dataset.campus === campusId) {
                card.classList.add('active');
            }
        });
        
        // Update WhatsApp button with campus info
        this.updateWhatsAppButton();
        
        console.log(`Campus selected: ${this.campuses[campusId].name}`);
    }

    updateBudgetPresets() {
        document.querySelectorAll('.budget-preset').forEach(preset => {
            preset.classList.remove('active');
            if (parseInt(preset.dataset.budget) === this.currentBudget) {
                preset.classList.add('active');
            }
        });
    }

    updateWhatsAppButton() {
        const campus = this.campuses[this.currentCampus];
        const message = encodeURIComponent(
            `Hi ChakulaChap! I'm at ${campus.name} with budget KES ${this.currentBudget}. Can you suggest meals?`
        );
        
        // Update all WhatsApp buttons
        document.querySelectorAll('a[href*="whatsapp"]').forEach(link => {
            link.href = `https://wa.me/254778796999?text=${message}`;
        });
    }

    async findMeals() {
        const campus = this.campuses[this.currentCampus];
        if (!campus) return;
        
        // Show loading
        this.showLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter meals by budget
        const affordableMeals = campus.meals.filter(meal => meal.price <= this.currentBudget);
        
        // Sort by value (rating/price ratio)
        affordableMeals.sort((a, b) => {
            const valueA = (a.rating * 10) / a.price;
            const valueB = (b.rating * 10) / b.price;
            return valueB - valueA;
        });
        
        // Render results
        this.renderResults(affordableMeals);
        
        // Hide loading
        this.showLoading(false);
        
        // Scroll to results
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
        
        // Update WhatsApp button with specific query
        const mealNames = affordableMeals.slice(0, 3).map(m => m.name).join(', ');
        const whatsappMessage = encodeURIComponent(
            `Found ${affordableMeals.length} meals under KES ${this.currentBudget} at ${campus.name}. Top picks: ${mealNames}`
        );
        
        const resultsBtn = document.querySelector('#results .btn-whatsapp');
        if (resultsBtn) {
            resultsBtn.href = `https://wa.me/254778796999?text=${whatsappMessage}`;
        }
    }

    renderResults(meals) {
        const container = document.getElementById('resultsContainer');
        const campus = this.campuses[this.currentCampus];
        
        if (meals.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">😔</div>
                    <h3>No Meals Found</h3>
                    <p>We couldn't find meals under KES ${this.currentBudget} at ${campus.name}.</p>
                    <div style="margin-top: var(--space-xl);">
                        <p><strong>Suggestions:</strong></p>
                        <ul style="text-align: left; display: inline-block; margin-top: var(--space-md);">
                            <li>Try increasing your budget to KES ${Math.min(...campus.meals.map(m => m.price))}</li>
                            <li>Check hostel kiosks for cheaper options</li>
                            <li>Consider buying ingredients instead</li>
                        </ul>
                    </div>
                    <div style="margin-top: var(--space-xl);">
                        <a href="https://wa.me/254778796999?text=Help%20me%20find%20meals%20under%20KES%20${this.currentBudget}%20at%20${campus.name}" 
                           class="btn btn-whatsapp" target="_blank">
                            <i class="ri-whatsapp-line"></i> Get Help on WhatsApp
                        </a>
                    </div>
                </div>
            `;
            return;
        }
        
        // Calculate statistics
        const cheapest = meals.reduce((min, meal) => meal.price < min.price ? meal : min, meals[0]);
        const averagePrice = meals.reduce((sum, meal) => sum + meal.price, 0) / meals.length;
        const savings = this.currentBudget - cheapest.price;
        
        container.innerHTML = `
            <div class="results-header">
                <div>
                    <h3 style="color: var(--dark); margin-bottom: var(--space-xs);">
                        ${meals.length} Meals Found at ${campus.name}
                    </h3>
                    <p style="color: var(--gray-600);">All under KES ${this.currentBudget}</p>
                </div>
                <div class="results-stats">
                    <div style="display: flex; gap: var(--space-lg);">
                        <div style="text-align: center;">
                            <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary);">KES ${cheapest.price}</div>
                            <div style="font-size: 0.875rem; color: var(--gray-600);">Cheapest</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary);">KES ${Math.round(averagePrice)}</div>
                            <div style="font-size: 0.875rem; color: var(--gray-600);">Average</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary);">KES ${savings}</div>
                            <div style="font-size: 0.875rem; color: var(--gray-600);">You Save</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="results-grid" style="margin-top: var(--space-xl);">
                ${meals.slice(0, 6).map((meal, index) => `
                    <div class="meal-result-card ${index === 0 ? 'featured' : ''}">
                        <div class="meal-card-header">
                            <div class="meal-price">KES ${meal.price}</div>
                            <div class="meal-name">${meal.name}</div>
                        </div>
                        <div class="meal-card-body">
                            <div class="meal-details">
                                <div class="meal-vendor">
                                    <i class="ri-store-line"></i>
                                    ${meal.vendor}
                                </div>
                                <div class="meal-health">
                                    <span class="health-stars">
                                        ${'★'.repeat(Math.floor(meal.rating))}${'☆'.repeat(5 - Math.floor(meal.rating))}
                                    </span>
                                    <span style="margin-left: var(--space-xs);">${meal.rating.toFixed(1)}</span>
                                </div>
                            </div>
                            
                            <div style="margin-top: var(--space-md);">
                                <p style="color: var(--gray-600); font-size: 0.875rem;">
                                    <i class="ri-map-pin-line" style="margin-right: var(--space-xs);"></i>
                                    ${meal.location}
                                </p>
                                <p style="color: var(--gray-600); font-size: 0.875rem; margin-top: var(--space-xs);">
                                    <i class="ri-fire-line" style="margin-right: var(--space-xs);"></i>
                                    ${meal.calories} calories
                                </p>
                            </div>
                            
                            ${meal.tags ? `
                                <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs); margin-top: var(--space-md);">
                                    ${meal.tags.map(tag => `
                                        <span style="background: var(--gray-100); padding: var(--space-xs) var(--space-sm); border-radius: var(--radius-full); font-size: 0.75rem; color: var(--gray-600);">
                                            ${tag}
                                        </span>
                                    `).join('')}
                                </div>
                            ` : ''}
                            
                            <div class="meal-tip">
                                <i class="ri-lightbulb-line"></i> ${meal.tip}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: var(--space-2xl); text-align: center;">
                <div style="background: var(--gray-100); padding: var(--space-xl); border-radius: var(--radius-lg);">
                    <h4 style="margin-bottom: var(--space-md);">💰 Budget Analysis</h4>
                    <p style="margin-bottom: var(--space-md);">
                        With KES ${this.currentBudget}, you can afford ${meals.length} different meals at ${campus.name}.
                        The <strong>${cheapest.name}</strong> at ${cheapest.vendor} is your best budget option at KES ${cheapest.price}.
                    </p>
                    ${this.currentBudget < 100 ? `
                        <p style="color: var(--warning); margin-bottom: var(--space-md);">
                            <strong>Budget Tip:</strong> With less than KES 100, focus on staples like githeri, chapati, or boiled eggs for maximum value.
                        </p>
                    ` : ''}
                    
                    <div style="display: flex; gap: var(--space-lg); justify-content: center; margin-top: var(--space-xl);">
                        <a href="https://wa.me/254778796999?text=I%20want%20to%20save%20this%20meal%20plan" 
                           class="btn btn-whatsapp" target="_blank">
                            <i class="ri-whatsapp-line"></i> Save to WhatsApp
                        </a>
                        <button class="btn" style="background: var(--gray-200); color: var(--gray-700);" onclick="app.shareResults()">
                            <i class="ri-share-line"></i> Share Results
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        const findBtn = document.getElementById('findMealsBtn');
        
        if (show) {
            overlay.classList.add('active');
            findBtn.classList.add('loading');
            this.isLoading = true;
        } else {
            overlay.classList.remove('active');
            findBtn.classList.remove('loading');
            this.isLoading = false;
        }
    }

    toggleTheme() {
        const body = document.body;
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        }
    }

    toggleMobileMenu() {
        const menu = document.querySelector('.mobile-menu');
        const btn = document.querySelector('.mobile-menu-btn i');
        
        if (menu.style.display === 'flex') {
            menu.style.display = 'none';
            btn.classList.remove('ri-close-line');
            btn.classList.add('ri-menu-line');
        } else {
            menu.style.display = 'flex';
            btn.classList.remove('ri-menu-line');
            btn.classList.add('ri-close-line');
        }
    }

    updateUI() {
        // Update stats
        const campus = this.campuses[this.currentCampus];
        if (campus) {
            document.querySelector('.stat-card:nth-child(1) .stat-number').textContent = 
                Object.keys(this.campuses).length + '+';
            document.querySelector('.stat-card:nth-child(2) .stat-number').textContent = 
                campus.stats.meals + '+';
            document.querySelector('.stat-card:nth-child(3) .stat-number').textContent = 
                'KES ' + campus.stats.avgPrice;
            document.querySelector('.stat-card:nth-child(4) .stat-number').textContent = 
                campus.stats.students + '+';
        }
    }

    shareResults() {
        const campus = this.campuses[this.currentCampus];
        const text = `I found ${campus.meals.length} affordable meals at ${campus.name} using ChakulaChap Kenya! Check it out: ${window.location.href}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'ChakulaChap Kenya',
                text: text,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(text).then(() => {
                alert('Results copied to clipboard!');
            });
        }
    }

    showInstallPrompt() {
        // In a real app, you'd show a custom install prompt
        console.log('PWA install available');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ChakulaChapApp();
});

// Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(() => {
            console.log('Service Worker registered');
        });
    });
}