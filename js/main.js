// DOM Elements
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

// Event Listeners
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

    // Close dropdowns when clicking outside
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
        showNotification('Login successful!', 'success');
        authModal.classList.remove('active');
        // Store user session
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
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
        showNotification('Account created successfully!', 'success');
        authModal.classList.remove('active');
        switchAuthTab('login');
    }
}

// Notification System
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

// Initialize Dashboard
function initDashboard() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        authModal.classList.add('active');
    }
    
    // Initialize charts
    setTimeout(() => {
        if (typeof initCharts === 'function') {
            initCharts();
        }
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