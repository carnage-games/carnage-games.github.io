// CARNAGE - Complete Application JavaScript
// Optimized and error-free implementation

class CarnageApp {
    constructor() {
        this.currentPage = 'home';
        this.currentTheme = localStorage.getItem('carnage-theme') || 'dark';
        this.settings = this.loadSettings();
        this.isAuthenticated = sessionStorage.getItem('carnage-auth') === 'true';
        this.init();
    }

    init() {
        if (!this.isAuthenticated) {
            this.showLogin();
        } else {
            this.showMainApp();
        }
        this.setupEventListeners();
        this.applyTheme();
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('carnage-settings');
            return saved ? JSON.parse(saved) : {
                theme: 'dark',
                notifications: true,
                animations: true,
                autoSave: true
            };
        } catch (error) {
            return { theme: 'dark', notifications: true, animations: true, autoSave: true };
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('carnage-settings', JSON.stringify(this.settings));
            localStorage.setItem('carnage-theme', this.currentTheme);
        } catch (error) {
            console.warn('Failed to save settings');
        }
    }

    setupEventListeners() {
        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.loadPage(page);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case '1': e.preventDefault(); this.loadPage('home'); break;
                    case '2': e.preventDefault(); this.loadPage('games'); break;
                    case '3': e.preventDefault(); this.loadPage('music'); break;
                    case '4': e.preventDefault(); this.loadPage('bookmarklets'); break;
                    case '5': e.preventDefault(); this.loadPage('system'); break;
                    case '6': e.preventDefault(); this.loadPage('settings'); break;
                    case 't': e.preventDefault(); this.toggleTheme(); break;
                }
            }
            if (e.key === 'Escape') {
                this.closeModals();
            }
        });

        // Auto-save
        if (this.settings.autoSave) {
            setInterval(() => this.autoSave(), 30000);
        }
    }

    showLogin() {
        document.getElementById('login-container').classList.remove('hidden');
        document.getElementById('main-app').classList.add('hidden');
    }

    showMainApp() {
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        this.loadPage('home');
    }

    authenticate(password) {
        if (password === 'carnage2024') {
            sessionStorage.setItem('carnage-auth', 'true');
            this.isAuthenticated = true;
            this.showMainApp();
            this.showNotification('Login successful!', 'success');
            return true;
        }
        this.showNotification('Invalid password', 'error');
        return false;
    }

    logout() {
        sessionStorage.removeItem('carnage-auth');
        this.isAuthenticated = false;
        this.showLogin();
        this.showNotification('Logged out successfully', 'info');
    }

    loadPage(page) {
    this.currentPage = page;
    this.saveSettings(); // Save current state
    
    // Check if we're already on the target page
    const currentPath = window.location.pathname;
    const targetPath = `pages/${page}.html`;
    
    if (!currentPath.includes(targetPath)) {
        window.location.href = targetPath;
    }
}



    getPageTitle(page) {
        const titles = {
            home: 'Dashboard',
            games: 'Games',
            music: 'Music',
            bookmarklets: 'Bookmarkles',
            system: 'System',
            settings: 'Settings'
        };
        return titles[page] || 'Dashboard';
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.settings.theme = this.currentTheme;
        this.applyTheme();
        this.saveSettings();
        this.showNotification(`Switched to ${this.currentTheme} theme`, 'success');
    }

    showNotification(message, type = 'info', duration = 3000) {
        if (!this.settings.notifications) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--secondary-bg);
            color: var(--text-primary);
            padding: 1rem 1.5rem;
            border-radius: 8px;
            border-left: 4px solid ${this.getNotificationColor(type)};
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span>${this.getNotificationIcon(type)}</span>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: inherit; cursor: pointer; margin-left: auto;">×</button>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    }

    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    autoSave() {
        const data = {
            currentPage: this.currentPage,
            settings: this.settings,
            timestamp: Date.now()
        };
        try {
            localStorage.setItem('carnage-autosave', JSON.stringify(data));
        } catch (error) {
            console.warn('Auto-save failed');
        }
    }

    closeModals() {
        document.querySelectorAll('.modal, .search-modal, .command-palette-modal').forEach(modal => {
            modal.remove();
        });
    }

    exportData() {
        const data = {
            settings: this.settings,
            theme: this.currentTheme,
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `carnage-backup-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showNotification('Data exported successfully', 'success');
    }
}

// System Monitor
class SystemMonitor {
    constructor() {
        this.isMonitoring = false;
        this.updateInterval = null;
    }

    start() {
        if (this.isMonitoring) return;
        this.isMonitoring = true;
        this.update();
        this.updateInterval = setInterval(() => this.update(), 5000);
    }

    stop() {
        this.isMonitoring = false;
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    update() {
        try {
            const info = this.getSystemInfo();
            this.updateDisplay(info);
        } catch (error) {
            console.warn('System monitor update failed:', error);
        }
    }

    getSystemInfo() {
        return {
            memory: this.getMemoryInfo(),
            performance: this.getPerformanceInfo(),
            connection: this.getConnectionInfo(),
            battery: this.getBatteryInfo()
        };
    }

    getMemoryInfo() {
        if (performance.memory) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                total: Math.round(performance.memory.totalJSHeapSize / 1048576),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
            };
        }
        return null;
    }

    getPerformanceInfo() {
        const timing = performance.timing;
        return {
            loadTime: timing.loadEventEnd - timing.navigationStart,
            domReady: timing.domContentLoadedEventEnd - timing.navigationStart
        };
    }

    getConnectionInfo() {
        if (navigator.connection) {
            return {
                type: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            };
        }
        return { online: navigator.onLine };
    }

    getBatteryInfo() {
        // Battery API is deprecated, return placeholder
        return { level: 'N/A', charging: 'N/A' };
    }

    updateDisplay(info) {
        // Update system info display if on system page
        if (app.currentPage === 'system') {
            this.updateSystemCards(info);
        }
    }

    updateSystemCards(info) {
        // This would update the system page cards
        // Implementation depends on the system page structure
    }
}

// Bookmarklets Manager
class BookmarkletsManager {
    constructor() {
        this.bookmarklets = {
            inspector: this.createInspectorBookmarklet(),
            outline: this.createOutlineBookmarklet(),
            performance: this.createPerformanceBookmarklet(),
            colorPicker: this.createColorPickerBookmarklet(),
            darkMode: this.createDarkModeBookmarklet()
        };
    }

    createInspectorBookmarklet() {
        return `javascript:(function(){
            if(document.getElementById('carnage-inspector')){
                document.getElementById('carnage-inspector').remove();
                return;
            }
            var inspector = document.createElement('div');
            inspector.id = 'carnage-inspector';
            inspector.style.cssText = 'position:fixed;top:10px;right:10px;width:300px;height:400px;background:#1a1a1a;border:2px solid #ff6b35;border-radius:10px;z-index:999999;color:#fff;font-family:monospace;font-size:12px;overflow:auto;padding:10px;';
            inspector.innerHTML = '<h3 style="color:#ff6b35;text-align:center;">CARNAGE Inspector</h3><div><strong>URL:</strong> ' + window.location.href + '<br><strong>Title:</strong> ' + document.title + '<br><strong>Elements:</strong> ' + document.querySelectorAll('*').length + '</div><button onclick="this.parentElement.remove()" style="position:absolute;top:5px;right:5px;background:#ff6b35;border:none;color:#fff;padding:5px;border-radius:5px;cursor:pointer;">×</button>';
            document.body.appendChild(inspector);
        })();`;
    }

    createOutlineBookmarklet() {
        return `javascript:(function(){
            if(document.getElementById('carnage-outline')){
                document.getElementById('carnage-outline').remove();
                return;
            }
            var style = document.createElement('style');
            style.id = 'carnage-outline';
            style.textContent = '* { outline: 1px solid #ff6b35 !important; }';
            document.head.appendChild(style);
        })();`;
    }

    createPerformanceBookmarklet() {
        return `javascript:(function(){
            var timing = performance.timing;
            var loadTime = timing.loadEventEnd - timing.navigationStart;
            alert('Page Load Time: ' + loadTime + 'ms\\nDOM Ready: ' + (timing.domContentLoadedEventEnd - timing.navigationStart) + 'ms');
        })();`;
    }

    createColorPickerBookmarklet() {
        return `javascript:(function(){
            document.addEventListener('click', function(e){
                var style = getComputedStyle(e.target);
                alert('Background: ' + style.backgroundColor + '\\nColor: ' + style.color);
            });
        })();`;
    }

    createDarkModeBookmarklet() {
        return `javascript:(function(){
            if(document.getElementById('carnage-dark')){
                document.getElementById('carnage-dark').remove();
                return;
            }
            var style = document.createElement('style');
            style.id = 'carnage-dark';
            style.textContent = '* { background-color: #1a1a1a !important; color: #ffffff !important; }';
            document.head.appendChild(style);
        })();`;
    }

    showBookmarklet(type) {
        const code = this.bookmarklets[type];
        if (!code) return;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        modal.innerHTML = `
            <div style="background: var(--secondary-bg); border: 1px solid var(--border-color); border-radius: 15px; padding: 2rem; max-width: 600px; width: 90%;">
                <h3 style="color: var(--primary-accent); margin-bottom: 1rem;">${type.charAt(0).toUpperCase() + type.slice(1)} Bookmarklet</h3>
                <textarea readonly style="width: 100%; height: 200px; background: var(--primary-bg); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; font-family: monospace; font-size: 12px; resize: vertical;">${code}</textarea>
                <div style="margin-top: 1rem; display: flex; gap: 1rem;">
                    <button onclick="this.copyBookmarklet('${type}')" style="background: var(--primary-accent); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;">Copy Code</button>
                    <button onclick="this.closest('.modal').remove()" style="background: var(--border-color); color: var(--text-primary); border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;">Close</button>
                </div>
            </div>
        `;

        modal.querySelector('button').onclick = () => this.copyBookmarklet(type);
        document.body.appendChild(modal);
    }

    copyBookmarklet(type) {
        const code = this.bookmarklets[type];
        navigator.clipboard.writeText(code).then(() => {
            app.showNotification('Bookmarklet copied to clipboard!', 'success');
        }).catch(() => {
            app.showNotification('Failed to copy bookmarklet', 'error');
        });
    }
}

// Search Manager
class SearchManager {
    constructor() {
        this.searchHistory = this.loadSearchHistory();
    }

    loadSearchHistory() {
        try {
            const saved = localStorage.getItem('carnage-search-history');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            return [];
        }
    }

    saveSearchHistory() {
        try {
            localStorage.setItem('carnage-search-history', JSON.stringify(this.searchHistory));
        } catch (error) {
            console.warn('Failed to save search history');
        }
    }

    showSearchModal() {
        const modal = document.createElement('div');
        modal.className = 'search-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: flex-start;
            justify-content: center;
            z-index: 10000;
            padding-top: 10vh;
        `;

        modal.innerHTML = `
            <div style="background: var(--secondary-bg); border: 1px solid var(--border-color); border-radius: 15px; padding: 0; max-width: 600px; width: 90%; max-height: 70vh; overflow: hidden;">
                <div style="padding: 1.5rem; border-bottom: 1px solid var(--border-color);">
                    <input type="text" id="search-input" placeholder="Search CARNAGE..." style="width: 100%; padding: 1rem; background: rgba(255, 107, 53, 0.1); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary); font-size: 1.1rem;">
                </div>
                <div id="search-results" style="max-height: 300px; overflow-y: auto; padding: 1rem;">
                    <div style="color: var(--text-secondary); text-align: center;">Start typing to search...</div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const searchInput = modal.querySelector('#search-input');
        const searchResults = modal.querySelector('#search-results');

        searchInput.focus();

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                this.performSearch(query, searchResults);
            } else {
                searchResults.innerHTML = '<div style="color: var(--text-secondary); text-align: center;">Start typing to search...</div>';
            }
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.remove();
            }
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    performSearch(query, resultsContainer) {
        // Simple search implementation
        const searchableContent = [
            { title: 'Dashboard', page: 'home', description: 'Main dashboard and overview' },
            { title: 'Games', page: 'games', description: 'Gaming section with various games' },
            { title: 'Music', page: 'music', description: 'Music player and audio content' },
            { title: 'Tools', page: 'bookmarklets', description: 'Bookmarklets and utilities' },
            { title: 'System', page: 'system', description: 'System information and monitoring' },
            { title: 'Settings', page: 'settings', description: 'Application settings and preferences' }
        ];

        const results = searchableContent.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );

        if (results.length === 0) {
            resultsContainer.innerHTML = '<div style="color: var(--text-secondary); text-align: center;">No results found</div>';
            return;
        }

        resultsContainer.innerHTML = results.map(result => `
            <div onclick="app.loadPage('${result.page}'); this.closest('.search-modal').remove();" 
                 style="padding: 1rem; border-bottom: 1px solid var(--border-color); cursor: pointer; transition: background 0.2s;"
                 onmouseover="this.style.background='rgba(255, 107, 53, 0.1)'"
                 onmouseout="this.style.background='transparent'">
                <div style="color: var(--text-primary); font-weight: 500;">${result.title}</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">${result.description}</div>
            </div>
        `).join('');

        // Add to search history
        this.addToHistory(query);
    }

    addToHistory(query) {
        this.searchHistory = this.searchHistory.filter(item => item !== query);
        this.searchHistory.unshift(query);
        this.searchHistory = this.searchHistory.slice(0, 10);
        this.saveSearchHistory();
    }
}

// Global Functions
function authenticate() {
    const password = document.getElementById('password-input').value;
    const errorMessage = document.getElementById('error-message');
    
    if (app.authenticate(password)) {
        document.getElementById('password-input').value = '';
        errorMessage.textContent = '';
        errorMessage.classList.remove('show');
    } else {
        errorMessage.textContent = 'Invalid access code';
        errorMessage.classList.add('show');
        document.getElementById('password-input').value = '';
    }
}

function logout() {
    app.logout();
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {
            app.showNotification('Fullscreen not supported', 'warning');
        });
    } else {
        document.exitFullscreen();
    }
}

function showBookmarkletModal(type) {
    bookmarkletsManager.showBookmarklet(type);
}

function copyBookmarklet(type) {
    bookmarkletsManager.copyBookmarklet(type);
}

function showSearch() {
    searchManager.showSearchModal();
}

function exportData() {
    app.exportData();
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings?')) {
        localStorage.clear();
        sessionStorage.clear();
        location.reload();
    }
}

// Initialize Application
let app, systemMonitor, bookmarkletsManager, searchManager;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize main application
    app = new CarnageApp();
    window.app = app;

    // Initialize managers
    systemMonitor = new SystemMonitor();
    bookmarkletsManager = new BookmarkletsManager();
    searchManager = new SearchManager();

    // Make managers globally available
    window.systemMonitor = systemMonitor;
    window.bookmarkletsManager = bookmarkletsManager;
    window.searchManager = searchManager;

    // Setup global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchManager.showSearchModal();
        }
    });

    // Handle login form
    const passwordInput = document.getElementById('password-input');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                authenticate();
            }
        });
    }

    // Start system monitoring if on system page
    if (app.currentPage === 'system') {
        systemMonitor.start();
    }

    // Add search button to header
    const headerActions = document.querySelector('.header-actions');
    if (headerActions) {
        const searchBtn = document.createElement('button');
        searchBtn.className = 'action-btn';
        searchBtn.innerHTML = '<div style="width: 16px; height: 16px; border: 2px solid currentColor; border-radius: 50%; position: relative;"><div style="position: absolute; width: 6px; height: 2px; background: currentColor; transform: rotate(45deg); top: 12px; left: 12px;"></div></div>';
        searchBtn.title = 'Search (Ctrl+K)';
        searchBtn.onclick = () => searchManager.showSearchModal();
        headerActions.insertBefore(searchBtn, headerActions.firstChild);
    }

    console.log('🔥 CARNAGE Application Initialized Successfully!');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        systemMonitor.stop();
    } else if (app.currentPage === 'system') {
        systemMonitor.start();
    }
});

// Handle window beforeunload
window.addEventListener('beforeunload', () => {
    app.saveSettings();
    systemMonitor.stop();
});

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            console.log('Service Worker registration failed');
        });
    });
}

// Export for external use
window.CarnageApp = CarnageApp;
window.authenticate = authenticate;
window.logout = logout;
window.toggleFullscreen = toggleFullscreen;
window.showBookmarkletModal = showBookmarkletModal;
window.copyBookmarklet = copyBookmarklet;
window.showSearch = showSearch;
window.exportData = exportData;
window.resetSettings = resetSettings;

// Navigation functionality
        document.addEventListener('DOMContentLoaded', () => {
            // Get current page from URL
            const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-page') === currentPage) {
                    link.classList.add('active');
                }
            });
        });

        // Add smooth scrolling for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Add loading animation for navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                // Add loading state
                this.style.opacity = '0.7';
                this.style.pointerEvents = 'none';
                
                // Reset after a short delay (in case navigation fails)
                setTimeout(() => {
                    this.style.opacity = '1';
                    this.style.pointerEvents = 'auto';
                }, 2000);
            });
        });

        // Add hover effects for cards
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        // Animate progress bars on load
        window.addEventListener('load', () => {
            document.querySelectorAll('.progress-fill').forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 500);
            });
        });

        // Add notification system
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        // Welcome notification
        setTimeout(() => {
            showNotification('Welcome to CARNAGE Dashboard!', 'success');
        }, 1000);