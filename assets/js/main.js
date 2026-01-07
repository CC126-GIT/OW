/**
 * 守望先锋风格网站 - 主JavaScript文件
 * 功能：导航栏交互、英雄筛选、卡片动画、移动端优化
 */

// 使用严格模式保证代码质量
'use strict';

// ==================== 主应用对象 ====================
const App = {
    
    /**
     * 初始化所有功能
     */
    init: function() {
        console.log('网站初始化...');
        
        // 等待DOM完全加载后执行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', this.onDOMReady.bind(this));
        } else {
            this.onDOMReady();
        }
    },
    
    /**
     * DOM就绪后执行
     */
    onDOMReady: function() {
        console.log('DOM已就绪，开始初始化模块');
        
        // 初始化各个功能模块
        this.initNavbar();
        this.initHeroFilter();
        this.initCardInteractions();
        this.initMobileMenu();
        this.initScrollEffects();
        this.initMockData();
        
        // 标记初始化完成
        document.body.classList.add('js-loaded');
        console.log('所有模块初始化完成');
    },
    
    // ==================== 模块1: 导航栏交互 ====================
    initNavbar: function() {
        const navbar = document.querySelector('.site-header, .ow-navbar');
        if (!navbar) return;
        
        // 滚动时改变导航栏样式
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                navbar.style.backgroundColor = 'rgba(10, 15, 26, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
                navbar.style.padding = '0.5rem 0';
            } else {
                navbar.style.backgroundColor = 'rgba(10, 15, 26, 0.95)';
                navbar.style.boxShadow = 'none';
                navbar.style.padding = '1rem 0';
            }
            
            // 向下滚动隐藏，向上滚动显示（移动端）
            if (window.innerWidth < 768) {
                if (scrollTop > lastScrollTop && scrollTop > 200) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }
            
            lastScrollTop = scrollTop;
        });
        
        // 高亮当前页面导航
        this.highlightCurrentPage();
    },
    
    /**
     * 高亮当前页面对应的导航链接
     */
    highlightCurrentPage: function() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.site-nav .nav-link, .ow-navbar__link');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath && currentPath.includes(linkPath.replace('../', '').replace('./', ''))) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    },
    
    // ==================== 模块2: 英雄筛选功能 ====================
    initHeroFilter: function() {
        const filterButtons = document.querySelectorAll('.filter-nav__btn');
        const heroCards = document.querySelectorAll('[data-category]');
        
        if (filterButtons.length === 0 || heroCards.length === 0) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // 更新按钮活动状态
                filterButtons.forEach(btn => btn.classList.remove('filter-nav__btn--active'));
                button.classList.add('filter-nav__btn--active');
                
                // 获取筛选类别
                const filter = button.getAttribute('data-filter');
                
                // 筛选显示英雄卡片
                heroCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || filter === category) {
                        card.style.display = 'block';
                        // 添加淡入动画
                        card.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // 更新结果计数
                this.updateResultCount(filter, heroCards);
            });
        });
        
        // 添加淡入动画的CSS
        this.addFilterAnimationCSS();
    },
    
    /**
     * 更新筛选结果计数
     */
    updateResultCount: function(filter, cards) {
        const counter = document.getElementById('resultCounter') || this.createResultCounter();
        let count = 0;
        
        if (filter === 'all') {
            count = cards.length;
        } else {
            count = Array.from(cards).filter(card => 
                card.getAttribute('data-category') === filter
            ).length;
        }
        
        counter.textContent = `找到 ${count} 位英雄`;
    },
    
    /**
     * 创建结果计数器
     */
    createResultCounter: function() {
        const counter = document.createElement('div');
        counter.id = 'resultCounter';
        counter.className = 'result-counter';
        counter.textContent = '找到 0 位英雄';
        
        const filterNav = document.querySelector('.filter-nav');
        if (filterNav) {
            filterNav.appendChild(counter);
        }
        
        return counter;
    },
    
    /**
     * 添加筛选动画CSS
     */
    addFilterAnimationCSS: function() {
        if (document.getElementById('filter-animation-style')) return;
        
        const style = document.createElement('style');
        style.id = 'filter-animation-style';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .result-counter {
                text-align: center;
                margin-top: 1rem;
                color: #e85d04;
                font-weight: bold;
                font-size: 1.1rem;
            }
        `;
        
        document.head.appendChild(style);
    },
    
    // ==================== 模块3: 卡片交互 ====================
    initCardInteractions: function() {
        const cards = document.querySelectorAll('.ow-card, .hero-card');
        
        cards.forEach(card => {
            // 鼠标悬停效果
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
                this.style.boxShadow = '0 15px 35px rgba(232, 93, 4, 0.2)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            });
            
            // 点击卡片放大（移动端友好）
            card.addEventListener('click', function(e) {
                if (window.innerWidth < 768 && !e.target.closest('a')) {
                    this.classList.toggle('card-expanded');
                }
            });
            
            // 触摸设备优化
            card.addEventListener('touchstart', function() {
                this.style.transform = 'translateY(-4px)';
            }, { passive: true });
            
            card.addEventListener('touchend', function() {
                this.style.transform = 'translateY(0)';
            }, { passive: true });
        });
    },
    
    // ==================== 模块4: 移动端菜单优化 ====================
    initMobileMenu: function() {
        const toggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (!toggler || !navbarCollapse) return;
        
        // 点击外部区域关闭菜单
        document.addEventListener('click', (e) => {
            if (!navbarCollapse.contains(e.target) && !toggler.contains(e.target)) {
                if (navbarCollapse.classList.contains('show')) {
                    toggler.click(); // 模拟点击关闭
                }
            }
        });
        
        // 菜单项点击后自动折叠（移动端）
        const navItems = document.querySelectorAll('.navbar-nav .nav-link');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth < 768 && navbarCollapse.classList.contains('show')) {
                    toggler.click();
                }
            });
        });
    },
    
    // ==================== 模块5: 滚动效果 ====================
    initScrollEffects: function() {
        // 滚动显示元素（用于新闻/英雄列表的淡入效果）
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // 观察需要滚动显示的元素
        document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
            observer.observe(el);
        });
        
        // 添加回到顶部按钮
        this.addBackToTopButton();
    },
    
    /**
     * 添加回到顶部按钮
     */
    addBackToTopButton: function() {
        if (document.getElementById('back-to-top')) return;
        
        const button = document.createElement('button');
        button.id = 'back-to-top';
        button.className = 'back-to-top-btn';
        button.innerHTML = '↑';
        button.setAttribute('aria-label', '回到顶部');
        
        button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background-color: #e85d04;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(232, 93, 4, 0.3);
        `;
        
        document.body.appendChild(button);
        
        // 滚动显示/隐藏按钮
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                button.style.opacity = '1';
                button.style.visibility = 'visible';
                button.style.transform = 'translateY(0)';
            } else {
                button.style.opacity = '0';
                button.style.visibility = 'hidden';
                button.style.transform = 'translateY(20px)';
            }
        });
        
        // 点击回到顶部
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    },
    
    // ==================== 模块6: 模拟数据与工具函数 ====================
    initMockData: function() {
        // 模拟英雄数据（用于动态生成内容）
        this.mockHeroes = [
            { id: 1, name: '莱因哈特', role: 'tank', desc: '身穿重型装甲的先锋骑士' },
            { id: 2, name: '猎空', role: 'damage', desc: '操纵时间的冒险家' },
            { id: 3, name: '天使', role: 'support', desc: '拥有女武神快速反应服的治疗者' }
        ];
        
        // 模拟新闻数据
        this.mockNews = [
            { id: 1, title: '新赛季开启', date: '2023-12-01', category: '赛季' },
            { id: 2, title: '英雄平衡调整', date: '2023-11-20', category: '更新' },
            { id: 3, title: '冬季活动预告', date: '2023-11-15', category: '活动' }
        ];
        
        // 如果页面需要，可以动态生成内容
        this.generateDynamicContent();
    },
    
    /**
     * 生成动态内容（示例）
     */
    generateDynamicContent: function() {
        // 示例：在控制台输出数据
        console.log('可用英雄数据:', this.mockHeroes);
        console.log('最新新闻:', this.mockNews);
        
        // 这里可以扩展为实际生成DOM元素
        // 例如：动态生成新闻列表、英雄卡片等
    },
    
    // ==================== 工具函数 ====================
    
    /**
     * 防抖函数 - 优化滚动等高频事件
     */
    debounce: function(func, wait = 100) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * 节流函数 - 优化滚动等高频事件
     */
    throttle: function(func, limit = 300) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    /**
     * 获取当前页面类型
     */
    getCurrentPageType: function() {
        const path = window.location.pathname;
        if (path.includes('heroes')) return 'heroes';
        if (path.includes('news')) return 'news';
        return 'home';
    }
};

// ==================== 全局错误处理 ====================
window.addEventListener('error', function(e) {
    console.error('JavaScript错误:', e.message, '位于', e.filename, ':', e.lineno);
});

// ==================== 启动应用 ====================
// 确保在全局可用（用于调试）
window.App = App;

// 启动应用
App.init();

// 导出模块（如果使用模块化）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}

