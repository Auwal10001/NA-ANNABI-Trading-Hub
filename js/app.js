// ============================================
// COMBINED APPLICATION - ALL MODULES IN ONE FILE
// ============================================

// ============================================
// AUTHENTICATION MODULE
// ============================================
const AuthModule = (() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    return {
        register: (userData) => {
            const { name, email, password } = userData;

            if (!isValidEmail(email)) {
                return { success: false, message: 'Invalid email format' };
            }

            if (users.find(u => u.email === email)) {
                return { success: false, message: 'User already exists' };
            }

            const newUser = {
                id: Date.now(),
                name,
                email,
                password: hashPassword(password),
                createdAt: new Date().toISOString(),
                wallet: {
                    balance: 50000,
                    currency: 'USD'
                }
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            return { success: true, message: 'User registered successfully', user: newUser };
        },

        login: (email, password) => {
            const user = users.find(u => u.email === email);

            if (!user) {
                return { success: false, message: 'User not found' };
            }

            if (user.password !== hashPassword(password)) {
                return { success: false, message: 'Invalid password' };
            }

            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', 'true');

            return { success: true, message: 'Login successful', user };
        },

        logout: () => {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isLoggedIn');
            return { success: true, message: 'Logged out successfully' };
        },

        getCurrentUser: () => {
            const user = localStorage.getItem('currentUser');
            return user ? JSON.parse(user) : null;
        },

        updateProfile: (userId, updates) => {
            const userIndex = users.findIndex(u => u.id === userId);
            if (userIndex === -1) return { success: false, message: 'User not found' };

            users[userIndex] = { ...users[userIndex], ...updates };
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));

            return { success: true, user: users[userIndex] };
        },

        getWallet: (userId) => {
            const user = users.find(u => u.id === userId);
            return user ? user.wallet : null;
        },

        updateWallet: (userId, amount) => {
            const user = users.find(u => u.id === userId);
            if (!user) return { success: false };

            user.wallet.balance += amount;
            localStorage.setItem('users', JSON.stringify(users));

            return { success: true, wallet: user.wallet };
        }
    };
})();

// ============================================
// API INTEGRATION MODULE
// ============================================
const APIModule = (() => {
    const API_CONFIG = {
        COINGECKO: 'https://api.coingecko.com/api/v3',
        ALPHA_VANTAGE: 'https://www.alphavantage.co/query',
        FINNHUB: 'https://finnhub.io/api/v1',
        OPENEXCHANGERATES: 'https://openexchangerates.io/api'
    };

    return {
        getCryptoPrices: async () => {
            try {
                const response = await fetch(
                    `${API_CONFIG.COINGECKO}/simple/price?ids=bitcoin,ethereum,ripple&vs_currencies=usd&include_24hr_change=true`
                );
                const data = await response.json();
                return formatCryptoData(data);
            } catch (error) {
                console.error('Error fetching crypto prices:', error);
                return getMockCryptoData();
            }
        },

        getForexRates: async () => {
            try {
                return getMockForexData();
            } catch (error) {
                console.error('Error fetching forex rates:', error);
                return getMockForexData();
            }
        },

        getStockPrice: async (symbol) => {
            try {
                return getMockStockData(symbol);
            } catch (error) {
                console.error('Error fetching stock price:', error);
                return getMockStockData(symbol);
            }
        },

        getMarketData: async () => {
            try {
                const crypto = await APIModule.getCryptoPrices();
                const stocks = await Promise.all([
                    APIModule.getStockPrice('AAPL'),
                    APIModule.getStockPrice('MSFT'),
                    APIModule.getStockPrice('GOOGL')
                ]);
                const forex = await APIModule.getForexRates();

                return { crypto, stocks, forex };
            } catch (error) {
                console.error('Error fetching market data:', error);
                return getMockMarketData();
            }
        },

        getHistoricalData: async (asset) => {
            return generateMockHistoricalData(asset);
        }
    };

    function formatCryptoData(data) {
        return {
            bitcoin: {
                symbol: 'BTC',
                price: data.bitcoin?.usd || 43250,
                change24h: data.bitcoin?.usd_24h_change || 5.2
            },
            ethereum: {
                symbol: 'ETH',
                price: data.ethereum?.usd || 2345.80,
                change24h: data.ethereum?.usd_24h_change || 3.8
            },
            ripple: {
                symbol: 'XRP',
                price: data.ripple?.usd || 2.15,
                change24h: data.ripple?.usd_24h_change || -1.2
            }
        };
    }

    function getMockCryptoData() {
        return {
            bitcoin: { symbol: 'BTC', price: 43250, change24h: 5.2 },
            ethereum: { symbol: 'ETH', price: 2345.80, change24h: 3.8 },
            ripple: { symbol: 'XRP', price: 2.15, change24h: -1.2 }
        };
    }

    function getMockForexData() {
        return {
            eur_usd: { pair: 'EUR/USD', rate: 1.0850, change: 0.15 },
            gbp_usd: { pair: 'GBP/USD', rate: 1.2750, change: 0.25 },
            jpy_usd: { pair: 'USD/JPY', rate: 149.50, change: -0.15 }
        };
    }

    function getMockStockData(symbol) {
        const stocks = {
            'AAPL': { symbol: 'AAPL', price: 189.50, change: 2.3, changePercent: 1.23 },
            'MSFT': { symbol: 'MSFT', price: 378.90, change: 1.8, changePercent: 0.48 },
            'GOOGL': { symbol: 'GOOGL', price: 142.30, change: -0.5, changePercent: -0.35 },
            'AMZN': { symbol: 'AMZN', price: 175.45, change: 3.2, changePercent: 1.85 }
        };
        return stocks[symbol] || stocks['AAPL'];
    }

    function getMockMarketData() {
        return {
            crypto: getMockCryptoData(),
            stocks: [getMockStockData('AAPL'), getMockStockData('MSFT'), getMockStockData('GOOGL')],
            forex: getMockForexData()
        };
    }

    function generateMockHistoricalData(asset) {
        const data = [];
        const now = new Date();
        let basePrice = Math.random() * 50000 + 25000;

        for (let i = 30; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            basePrice += (Math.random() - 0.48) * 1000;
            data.push({
                date: date.toISOString().split('T')[0],
                open: basePrice - 500,
                high: basePrice + 1000,
                low: basePrice - 1000,
                close: basePrice,
                volume: Math.floor(Math.random() * 1000000)
            });
        }

        return data;
    }
})();

// ============================================
// CHART MODULE
// ============================================
const ChartModule = (() => {
    const chartInstances = {};

    return {
        initCharts: async () => {
            if (typeof Chart === 'undefined') {
                console.warn('Chart.js not loaded');
                return;
            }

            await ChartModule.initForexChart();
            await ChartModule.initCryptoCharts();
            await ChartModule.initPortfolioChart();
        },

        initForexChart: async () => {
            const canvas = document.getElementById('forexChart');
            if (!canvas) return;

            const data = await APIModule.getHistoricalData('EUR/USD');
            const prices = data.map(d => d.close);
            const labels = data.map(d => d.date.split('-').slice(1).join('/'));

            chartInstances.forex = new Chart(canvas, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'EUR/USD',
                        data: prices,
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        hoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            labels: { color: '#f1f5f9', font: { size: 12 } }
                        }
                    },
                    scales: {
                        x: {
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: '#cbd5e1' }
                        },
                        y: {
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: '#cbd5e1' }
                        }
                    }
                }
            });
        },

        initCryptoCharts: async () => {
            const charts = [
                { id: 'cryptoChart1', asset: 'Bitcoin' },
                { id: 'cryptoChart2', asset: 'Ethereum' },
                { id: 'cryptoChart3', asset: 'Ripple' }
            ];

            for (const chart of charts) {
                const canvas = document.getElementById(chart.id);
                if (!canvas) continue;

                const data = await APIModule.getHistoricalData(chart.asset);
                const prices = data.map(d => d.close);
                const labels = data.map(d => d.date.split('-').slice(1).join('/'));

                chartInstances[chart.id] = new Chart(canvas, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: chart.asset,
                            data: prices,
                            borderColor: '#8b5cf6',
                            backgroundColor: 'rgba(139, 92, 246, 0.1)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.4,
                            pointRadius: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            x: { display: false },
                            y: { display: false }
                        }
                    }
                });
            }
        },

        initPortfolioChart: async () => {
            const canvas = document.getElementById('portfolioChart');
            if (!canvas) return;

            chartInstances.portfolio = new Chart(canvas, {
                type: 'doughnut',
                data: {
                    labels: ['Bitcoin', 'Ethereum', 'Stocks', 'Gold'],
                    datasets: [{
                        data: [21625, 11729, 9475, 20453],
                        backgroundColor: [
                            '#f59e0b',
                            '#8b5cf6',
                            '#6366f1',
                            '#fbbf24'
                        ],
                        borderColor: '#1e293b',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#f1f5f9', padding: 15 }
                        }
                    }
                }
            });
        },

        destroyChart: (chartId) => {
            if (chartInstances[chartId]) {
                chartInstances[chartId].destroy();
                delete chartInstances[chartId];
            }
        },

        updateChart: (chartId, newData) => {
            if (chartInstances[chartId]) {
                chartInstances[chartId].data.datasets[0].data = newData;
                chartInstances[chartId].update();
            }
        }
    };
})();

// ============================================
// TRADING MODULE
// ============================================
const TradingModule = (() => {
    const trades = JSON.parse(localStorage.getItem('trades')) || [];
    const positions = JSON.parse(localStorage.getItem('positions')) || [];

    return {
        placeTrade: (tradeData) => {
            const currentUser = AuthModule.getCurrentUser();
            if (!currentUser) return { success: false, message: 'User not logged in' };

            const { asset, type, amount, price, market } = tradeData;

            if (!asset || !type || !amount || !price) {
                return { success: false, message: 'Invalid trade data' };
            }

            const totalCost = amount * price;
            if (currentUser.wallet.balance < totalCost && type === 'BUY') {
                return { success: false, message: 'Insufficient funds' };
            }

            const trade = {
                id: Date.now(),
                userId: currentUser.id,
                asset,
                type,
                amount,
                price,
                market,
                totalValue: totalCost,
                status: 'OPEN',
                entryTime: new Date().toISOString(),
                exitTime: null,
                profitLoss: 0
            };

            if (type === 'BUY') {
                positions.push({
                    ...trade,
                    status: 'ACTIVE'
                });
                
                AuthModule.updateWallet(currentUser.id, -totalCost);
            } else if (type === 'SELL') {
                const positionIndex = positions.findIndex(
                    p => p.asset === asset && p.userId === currentUser.id && p.status === 'ACTIVE'
                );

                if (positionIndex === -1) {
                    return { success: false, message: 'No active position to sell' };
                }

                const position = positions[positionIndex];
                const profitLoss = (price - position.price) * amount;
                position.status = 'CLOSED';
                position.exitTime = new Date().toISOString();
                position.profitLoss = profitLoss;

                AuthModule.updateWallet(currentUser.id, totalCost + profitLoss);
            }

            trade.status = 'CLOSED';
            trades.push(trade);

            localStorage.setItem('trades', JSON.stringify(trades));
            localStorage.setItem('positions', JSON.stringify(positions));

            return {
                success: true,
                message: `${type} order placed successfully`,
                trade
            };
        },

        getUserTrades: (userId) => {
            return trades.filter(t => t.userId === userId);
        },

        getUserPositions: (userId) => {
            return positions.filter(p => p.userId === userId && p.status === 'ACTIVE');
        },

        closePosition: (positionId, exitPrice) => {
            const position = positions.find(p => p.id === positionId);
            if (!position) return { success: false, message: 'Position not found' };

            const profitLoss = (exitPrice - position.price) * position.amount;
            position.status = 'CLOSED';
            position.exitTime = new Date().toISOString();
            position.profitLoss = profitLoss;

            AuthModule.updateWallet(position.userId, position.amount * exitPrice + profitLoss);
            localStorage.setItem('positions', JSON.stringify(positions));

            return {
                success: true,
                message: 'Position closed successfully',
                position,
                profitLoss
            };
        },

        calculatePortfolioValue: (userId) => {
            const userPositions = positions.filter(p => p.userId === userId && p.status === 'ACTIVE');
            let totalValue = 0;
            let totalCost = 0;

            userPositions.forEach(position => {
                const currentPrice = position.price * (1 + Math.random() * 0.1 - 0.05);
                const positionValue = position.amount * currentPrice;
                totalValue += positionValue;
                totalCost += position.totalValue;
            });

            return {
                totalValue,
                totalCost,
                profitLoss: totalValue - totalCost,
                profitLossPercent: ((totalValue - totalCost) / totalCost * 100).toFixed(2)
            };
        },

        getTradeHistory: (userId, limit = 10) => {
            return trades
                .filter(t => t.userId === userId)
                .sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime))
                .slice(0, limit);
        },

        setStopLoss: (positionId, stopLossPrice) => {
            const position = positions.find(p => p.id === positionId);
            if (!position) return { success: false, message: 'Position not found' };

            position.stopLoss = stopLossPrice;
            localStorage.setItem('positions', JSON.stringify(positions));

            return { success: true, position };
        },

        setTakeProfit: (positionId, takeProfitPrice) => {
            const position = positions.find(p => p.id === positionId);
            if (!position) return { success: false, message: 'Position not found' };

            position.takeProfit = takeProfitPrice;
            localStorage.setItem('positions', JSON.stringify(positions));

            return { success: true, position };
        }
    };
})();

// ============================================
// UTILITY FUNCTIONS
// ============================================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function hashPassword(password) {
    return btoa(password);
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<strong>${type.toUpperCase()}:</strong> ${message}`;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// DOM MANAGEMENT & EVENT HANDLERS
// ============================================

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const themeToggle = document.getElementById('themeToggle');
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const userBtn = document.getElementById('userBtn');
const dropdownMenu = document.getElementById('dropdownMenu');
const navMenu = document.getElementById('navMenu');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const authModal = document.getElementById('authModal');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    setupEventListeners();
    initDashboard();
});

// Event Listeners Setup
function setupEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href').substring(1);
            switchSection(target);
            updateNavLinks(link);
        });
    });

    // Theme Toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Hamburger Menu
    hamburger.addEventListener('click', toggleSidebar);

    // User Menu
    userBtn.addEventListener('click', toggleDropdown);

    // Auth Tabs
    loginTab.addEventListener('click', () => switchAuthTab('login'));
    signupTab.addEventListener('click', () => switchAuthTab('signup'));

    // Auth Forms
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);

    // Close dropdowns
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu')) {
            dropdownMenu.classList.remove('active');
        }
    });
}

// Switch Section
function switchSection(sectionId) {
    sections.forEach(section => section.classList.remove('active'));
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo(0, 0);
    }
}

// Update Navigation Links
function updateNavLinks(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Theme Toggle
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('light-mode');
    localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
    updateThemeIcon();
}

function loadTheme() {
    const theme = localStorage.getItem('theme') || 'dark';
    if (theme === 'light') {
        document.body.classList.add('light-mode');
    }
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    const isDark = !document.body.classList.contains('light-mode');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

// Sidebar Toggle
function toggleSidebar() {
    sidebar.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Dropdown Menu
function toggleDropdown() {
    dropdownMenu.classList.toggle('active');
}

// Auth Tab Switch
function switchAuthTab(tab) {
    if (tab === 'login') {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
    } else {
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
    }
}

// Auth Handlers
function handleLogin(e) {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;
    
    if (email && password) {
        const result = AuthModule.login(email, password);
        if (result.success) {
            showNotification('Login successful!', 'success');
            authModal.classList.remove('active');
            switchSection('dashboard');
        } else {
            showNotification(result.message, 'error');
        }
    }
}

function handleSignup(e) {
    e.preventDefault();
    const inputs = signupForm.querySelectorAll('input');
    const name = inputs[0].value;
    const email = inputs[1].value;
    const password = inputs[2].value;
    const confirmPassword = inputs[3].value;
    
    if (name && email && password && confirmPassword) {
        if (password !== confirmPassword) {
            showNotification('Passwords do not match!', 'error');
            return;
        }
        const result = AuthModule.register({ name, email, password });
        if (result.success) {
            showNotification('Account created successfully!', 'success');
            switchAuthTab('login');
            // Clear form
            signupForm.reset();
        } else {
            showNotification(result.message, 'error');
        }
    }
}

// Initialize Dashboard
function initDashboard() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        authModal.classList.add('active');
    } else {
        authModal.classList.remove('active');
    }
    
    setTimeout(() => {
        ChartModule.initCharts();
    }, 100);
}

// Responsive Adjustments
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Add animations
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideOutRight {
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);