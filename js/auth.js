// Authentication Module
const AuthModule = (() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    return {
        // Register new user
        register: (userData) => {
            const { name, email, password } = userData;

            // Validate email
            if (!isValidEmail(email)) {
                return { success: false, message: 'Invalid email format' };
            }

            // Check if user exists
            if (users.find(u => u.email === email)) {
                return { success: false, message: 'User already exists' };
            }

            // Create user
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

        // Login user
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

        // Logout user
        logout: () => {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isLoggedIn');
            return { success: true, message: 'Logged out successfully' };
        },

        // Get current user
        getCurrentUser: () => {
            const user = localStorage.getItem('currentUser');
            return user ? JSON.parse(user) : null;
        },

        // Update user profile
        updateProfile: (userId, updates) => {
            const userIndex = users.findIndex(u => u.id === userId);
            if (userIndex === -1) return { success: false, message: 'User not found' };

            users[userIndex] = { ...users[userIndex], ...updates };
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));

            return { success: true, user: users[userIndex] };
        },

        // Get user wallet
        getWallet: (userId) => {
            const user = users.find(u => u.id === userId);
            return user ? user.wallet : null;
        },

        // Update wallet
        updateWallet: (userId, amount) => {
            const user = users.find(u => u.id === userId);
            if (!user) return { success: false };

            user.wallet.balance += amount;
            localStorage.setItem('users', JSON.stringify(users));

            return { success: true, wallet: user.wallet };
        }
    };
})();

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function hashPassword(password) {
    // Simple hash (in production, use proper encryption)
    return btoa(password);
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthModule;
}