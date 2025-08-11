// Resume Page Navigation and Functionality
document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 1;
    const totalPages = 6;
    let pageNavigation = null;
    
    // Get DOM elements
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages[i] = document.getElementById(`page-${i}`);
    }
    
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const pageIndicator = document.getElementById('current-page');
    
    // Ensure navigation controls are visible
    const navigationControls = document.querySelector('.navigation-controls');
    if (navigationControls) {
        navigationControls.style.display = 'flex';
    }
    
    // Navigation functions
    function showPage(pageNumber) {
        console.log('Navigating to page:', pageNumber);
        
        if (pageNumber < 1 || pageNumber > totalPages) {
            console.log('Invalid page number:', pageNumber);
            return;
        }
        
        // Hide all pages
        for (let i = 1; i <= totalPages; i++) {
            if (pages[i]) pages[i].style.display = 'none';
        }
        
        // Show requested page
        if (pages[pageNumber]) {
            pages[pageNumber].style.display = 'flex';
        }
        
        // Update navigation buttons
        if (prevBtn) {
            if (pageNumber === 1) {
                prevBtn.style.display = 'none';
                prevBtn.style.visibility = 'hidden';
            } else {
                prevBtn.style.display = 'inline-flex';
                prevBtn.style.visibility = 'visible';
                prevBtn.textContent = '← Previous';
            }
        }
        
        if (nextBtn) {
            if (pageNumber === totalPages) {
                nextBtn.style.display = 'none';
                nextBtn.style.visibility = 'hidden';
            } else {
                nextBtn.style.display = 'inline-flex';
                nextBtn.style.visibility = 'visible';
                nextBtn.textContent = 'Next Page →';
            }
        }
        
        // Update page indicator
        if (pageIndicator) {
            pageIndicator.textContent = `Page ${pageNumber} of ${totalPages}`;
        }
        
        // Update current page
        currentPage = pageNumber;
        
        // Update page navigation dots
        updatePageNavigation();
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Add page transition effect
        const activePage = pages[pageNumber];
        if (activePage) {
            activePage.style.opacity = '0';
            activePage.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                activePage.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                activePage.style.opacity = '1';
                activePage.style.transform = 'translateY(0)';
            });
        }
        
        // Update main content ID for accessibility
        document.querySelectorAll('[id="page-content"]').forEach(el => {
            el.removeAttribute('id');
        });
        if (activePage) {
            activePage.setAttribute('id', 'page-content');
        }
        
        // Update ARIA labels
        updateARIALabels();
    }
    
    function nextPage() {
        if (currentPage < totalPages) {
            showPage(currentPage + 1);
        }
    }
    
    function prevPage() {
        if (currentPage > 1) {
            showPage(currentPage - 1);
        }
    }
    
    // Update ARIA labels
    function updateARIALabels() {
        if (nextBtn && currentPage < totalPages) {
            nextBtn.setAttribute('aria-label', `Navigate to page ${currentPage + 1} of ${totalPages}`);
        }
        if (prevBtn && currentPage > 1) {
            prevBtn.setAttribute('aria-label', `Navigate to page ${currentPage - 1} of ${totalPages}`);
        }
    }
    
    // Add event listeners for navigation
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Next button clicked');
            nextPage();
        });
        
        // Ensure button is properly styled and visible
        nextBtn.style.display = 'inline-flex';
        nextBtn.style.visibility = 'visible';
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Previous button clicked');
            prevPage();
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Only handle navigation if not typing in an input
        if (document.activeElement.tagName !== 'INPUT' && 
            document.activeElement.tagName !== 'TEXTAREA') {
            
            if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                e.preventDefault();
                nextPage();
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                e.preventDefault();
                prevPage();
            } else if (e.key >= '1' && e.key <= '6') {
                // Direct page navigation with number keys
                e.preventDefault();
                const pageNum = parseInt(e.key);
                if (pageNum >= 1 && pageNum <= totalPages) {
                    showPage(pageNum);
                }
            }
        }
    });
    
    // Add page navigation shortcuts
    function createPageNavigation() {
        pageNavigation = document.createElement('div');
        pageNavigation.className = 'page-navigation no-print';
        pageNavigation.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
            background: var(--color-surface);
            padding: 8px 12px;
            border-radius: 20px;
            box-shadow: var(--shadow-lg);
            border: 1px solid var(--color-border);
            z-index: 1000;
        `;
        
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.className = 'page-nav-btn';
            pageBtn.setAttribute('data-page', i);
            pageBtn.style.cssText = `
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: 1px solid var(--color-border);
                background: var(--color-secondary);
                color: var(--color-text);
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            // Add click event listener
            pageBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const targetPage = parseInt(this.getAttribute('data-page'));
                console.log('Page navigation dot clicked:', targetPage);
                showPage(targetPage);
            });
            
            pageBtn.addEventListener('mouseenter', function() {
                if (parseInt(this.getAttribute('data-page')) !== currentPage) {
                    this.style.background = 'var(--color-secondary-hover)';
                    this.style.transform = 'scale(1.1)';
                }
            });
            
            pageBtn.addEventListener('mouseleave', function() {
                if (parseInt(this.getAttribute('data-page')) !== currentPage) {
                    this.style.background = 'var(--color-secondary)';
                    this.style.transform = 'scale(1)';
                }
            });
            
            pageNavigation.appendChild(pageBtn);
        }
        
        document.body.appendChild(pageNavigation);
    }
    
    // Update active page indicator
    function updatePageNavigation() {
        if (!pageNavigation) return;
        
        const pageBtns = pageNavigation.querySelectorAll('.page-nav-btn');
        pageBtns.forEach((btn) => {
            const pageNum = parseInt(btn.getAttribute('data-page'));
            if (pageNum === currentPage) {
                btn.style.background = 'var(--color-primary)';
                btn.style.color = 'var(--color-btn-primary-text)';
                btn.style.transform = 'scale(1.1)';
                btn.style.fontWeight = 'bold';
            } else {
                btn.style.background = 'var(--color-secondary)';
                btn.style.color = 'var(--color-text)';
                btn.style.transform = 'scale(1)';
                btn.style.fontWeight = '500';
            }
        });
    }
    
    // Print functionality - Enhanced version
    function setupPrint() {
        const printBtn = document.createElement('button');
        printBtn.className = 'btn btn--primary no-print';
        printBtn.innerHTML = '🖨️ Print CV';
        printBtn.setAttribute('aria-label', 'Print complete resume as PDF');
        printBtn.id = 'print-resume-btn';

        // Base styles
        printBtn.style.cssText = `
            position: fixed;
            z-index: 1000;
            font-size: 14px;
            padding: 10px 16px;
            background: var(--color-primary);
            color: var(--color-btn-primary-text);
            border: none;
            border-radius: var(--radius-base);
            cursor: pointer;
            box-shadow: var(--shadow-lg);
            transition: all 0.22s ease;
            font-family: var(--font-family-base);
            font-weight: var(--font-weight-medium);
            opacity: 1;
        `;

        // position depending on mobile or desktop
        if (isMobileScreen()) {
            printBtn.style.bottom = '18px';
            printBtn.style.left = '14px';
            printBtn.style.right = 'auto';
            printBtn.style.top = 'auto';
            printBtn.style.padding = '10px 14px';
        } else {
            printBtn.style.top = '20px';
            printBtn.style.right = '20px';
        }

        printBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });

        printBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });

        printBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            console.log('Print button clicked - preparing all 6 pages');

            // Show loading state
            const originalText = this.innerHTML;
            this.innerHTML = '⏳ Preparing...';
            this.disabled = true;

            // Store current page states
            const originalPageStates = {};
            for (let i = 1; i <= totalPages; i++) {
                if (pages[i]) {
                    originalPageStates[i] = {
                        display: pages[i].style.display,
                        opacity: pages[i].style.opacity,
                        transform: pages[i].style.transform,
                        transition: pages[i].style.transition
                    };
                }
            }

            // Make all pages visible for printing
            for (let i = 1; i <= totalPages; i++) {
                if (pages[i]) {
                    pages[i].style.display = 'flex';
                    pages[i].style.opacity = '1';
                    pages[i].style.transform = 'none';
                    pages[i].style.transition = 'none';
                }
            }

            // Add print-ready class to body
            document.body.classList.add('print-ready');

            // Trigger print after ensuring layout is ready
            setTimeout(() => {
                try {
                    // Force browser print dialog
                    window.print();
                    console.log('Print dialog opened for 6-page resume');
                } catch (error) {
                    console.log('Print failed:', error);
                    // Alternative method for some browsers
                    try {
                        document.execCommand('print');
                    } catch (fallbackError) {
                        console.log('Fallback print also failed:', fallbackError);
                        alert('Print failed. Please use Ctrl+P (Cmd+P on Mac) to print manually.');
                    }
                }

                // Restore original state
                setTimeout(() => {
                    document.body.classList.remove('print-ready');

                    // Restore original page states
                    for (let i = 1; i <= totalPages; i++) {
                        if (pages[i] && originalPageStates[i]) {
                            pages[i].style.display = originalPageStates[i].display;
                            pages[i].style.opacity = originalPageStates[i].opacity;
                            pages[i].style.transform = originalPageStates[i].transform;
                            pages[i].style.transition = originalPageStates[i].transition;
                        }
                    }

                    // Reset button
                    printBtn.innerHTML = originalText;
                    printBtn.disabled = false;

                    // Show current page properly
                    showPage(currentPage);
                }, 500);
            }, 200);
        });

        document.body.appendChild(printBtn);

        // Enhanced print event handlers remain the same
        window.addEventListener('beforeprint', function(e) {
            console.log('Before print event - showing all pages');
            document.body.classList.add('printing');

            for (let i = 1; i <= totalPages; i++) {
                if (pages[i]) {
                    pages[i].style.display = 'flex';
                    pages[i].style.opacity = '1';
                    pages[i].style.transform = 'none';
                    pages[i].style.transition = 'none';
                }
            }
        });

        window.addEventListener('afterprint', function(e) {
            console.log('After print event - restoring current page view');
            document.body.classList.remove('printing');

            setTimeout(() => {
                showPage(currentPage);
            }, 100);
        });

        // Return the created button so caller can use it (for auto-hide setup)
        return printBtn;
    }

    // Theme toggle functionality
    function setupTheme() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'btn btn--secondary no-print';
        themeToggle.innerHTML = '🌙';
        themeToggle.setAttribute('aria-label', 'Toggle dark mode');
        themeToggle.id = 'theme-toggle-btn';

        themeToggle.style.cssText = `
            position: fixed;
            z-index: 1000;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--color-secondary);
            border: 1px solid var(--color-border);
            color: var(--color-text);
            cursor: pointer;
            box-shadow: var(--shadow-md);
            transition: all 0.22s ease;
            font-size: 18px;
            opacity: 1;
        `;

        if (isMobileScreen()) {
            themeToggle.style.bottom = '18px';
            themeToggle.style.right = '14px';
            themeToggle.style.left = 'auto';
            themeToggle.style.top = 'auto';
        } else {
            themeToggle.style.top = '80px';
            themeToggle.style.right = '20px';
        }

        themeToggle.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });

        themeToggle.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow-md)';
        });

        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const currentTheme = document.documentElement.getAttribute('data-color-scheme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            console.log('Theme toggle clicked, switching to:', newTheme);

            document.documentElement.setAttribute('data-color-scheme', newTheme);
            this.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';

            // Save preference (with error handling since localStorage may not be available)
            try {
                localStorage.setItem('resume-theme', newTheme);
            } catch (e) {
                console.log('Could not save theme preference - localStorage not available');
            }

            // Add theme transition effect
            document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        });

        // Load saved theme
        try {
            const savedTheme = localStorage.getItem('resume-theme');
            if (savedTheme) {
                document.documentElement.setAttribute('data-color-scheme', savedTheme);
                themeToggle.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
            } else {
                // Use system preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    document.documentElement.setAttribute('data-color-scheme', 'dark');
                    themeToggle.innerHTML = '☀️';
                }
            }
        } catch (e) {
            console.log('Theme detection failed, using light theme');
        }

        document.body.appendChild(themeToggle);

        // Return the element so caller can wire up auto-hide
        return themeToggle;
    }

    
    // Contact interactions
    function setupContactInteractions() {
        const contactElements = document.querySelectorAll('.contact-item');
        
        contactElements.forEach(function(element) {
            const textSpan = element.querySelector('span:last-child');
            if (!textSpan) return;
            
            const text = textSpan.textContent;
            
            // Make email clickable
            if (text.includes('@')) {
                element.style.cursor = 'pointer';
                element.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.open('mailto:' + text, '_blank');
                });
                
                element.addEventListener('mouseenter', function() {
                    this.style.textDecoration = 'underline';
                });
                element.addEventListener('mouseleave', function() {
                    this.style.textDecoration = 'none';
                });
            }
            
            // Make LinkedIn clickable
            if (text.includes('linkedin.com')) {
                element.style.cursor = 'pointer';
                element.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.open('https://' + text, '_blank');
                });
                
                element.addEventListener('mouseenter', function() {
                    this.style.textDecoration = 'underline';
                });
                element.addEventListener('mouseleave', function() {
                    this.style.textDecoration = 'none';
                });
            }
            
            // Make GitHub clickable
            if (text.includes('github.com')) {
                element.style.cursor = 'pointer';
                element.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.open('https://' + text, '_blank');
                });
                
                element.addEventListener('mouseenter', function() {
                    this.style.textDecoration = 'underline';
                });
                element.addEventListener('mouseleave', function() {
                    this.style.textDecoration = 'none';
                });
            }

            // Make Portfolio clickable
            if (text.includes('github.io')) {
                element.style.cursor = 'pointer';

                element.addEventListener('click', function(e) {
                    const originalContent = element.innerHTML;
                    
                    element.innerHTML = '<span class="contact-icon">✘</span><span>portfolio coming soon</span>';
                    element.style.color = 'var(--color-info)';
                    
                    setTimeout(function() {
                        element.innerHTML = originalContent;
                        element.style.color = '';
                    }, 2000);
                });

                element.addEventListener('mouseenter', function() {
                    this.style.textDecoration = 'underline';
                });
                element.addEventListener('mouseleave', function() {
                    this.style.textDecoration = 'none';
                });
            }
            
            // Add copy to clipboard functionality
            element.addEventListener('dblclick', function(e) {
                e.preventDefault();
                copyToClipboard(text, element);
            });
            
            // Add accessibility
            element.setAttribute('tabindex', '0');
            element.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
        
        // Make GitHub project links clickable
        const githubLinks = document.querySelectorAll('.github-link');
        githubLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                window.open('https://' + link.textContent, '_blank');
            });
            
            link.setAttribute('tabindex', '0');
            link.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    link.click();
                }
            });
        });
    }
    
    function copyToClipboard(text, element) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function() {
                showCopyFeedback(element);
            }).catch(function() {
                fallbackCopy(text, element);
            });
        } else {
            fallbackCopy(text, element);
        }
    }
    
    function fallbackCopy(text, element) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showCopyFeedback(element);
        } catch (err) {
            console.log('Copy failed:', err);
        }
        
        document.body.removeChild(textArea);
    }
    
    function showCopyFeedback(element) {
        const originalContent = element.innerHTML;
        element.innerHTML = '<span class="contact-icon">✓</span><span>Copied!</span>';
        element.style.color = 'var(--color-success)';
        
        setTimeout(function() {
            element.innerHTML = originalContent;
            element.style.color = '';
        }, 2000);
    }
    
    // Add accessibility improvements
    function setupAccessibility() {
        // Add page landmarks
        for (let i = 1; i <= totalPages; i++) {
            if (pages[i]) {
                const pageContent = getPageContentDescription(i);
                pages[i].setAttribute('aria-label', `Resume page ${i}: ${pageContent}`);
                pages[i].setAttribute('role', 'main');
            }
        }
        
        // Add skip navigation
        const skipLink = document.createElement('a');
        skipLink.href = '#page-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            left: -9999px;
            width: 1px;
            height: 1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                background: var(--color-primary);
                color: var(--color-btn-primary-text);
                padding: 8px 12px;
                border-radius: 4px;
                text-decoration: none;
                z-index: 9999;
                width: auto;
                height: auto;
                overflow: visible;
                clip: auto;
                white-space: normal;
            `;
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.cssText = `
                position: absolute;
                left: -9999px;
                width: 1px;
                height: 1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
            `;
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    function getPageContentDescription(pageNumber) {
        const descriptions = {
            1: "Professional summary, technical skills",
            2: "Education, certifications, and awards",
            3: "Professional experience and achievements",
            4: "Major projects and technical implementations",
            5: "Additional projects and research contributions",
            6: "Leadership experience, volunteer work, and languages"
        };
        return descriptions[pageNumber] || "Resume content";
    }
    
    // Initialize all functionality
    console.log('Initializing 6-page resume application...');
    const printBtnElement = setupPrint();
    const themeToggleElement = setupTheme();

    // wire auto-hide only for mobile
    setupMobileAutoHide([printBtnElement, themeToggleElement], 3000);

    setupContactInteractions();
    setupAccessibility();
    createPageNavigation();
    setupSwipeNavigation();
    
    // Initialize first page with proper button states
    showPage(1);
    
    // Add smooth loading animation
    document.body.style.opacity = '0';
    setTimeout(function() {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
        
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    }, 100);
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            showPage(currentPage);
        }, 250);
    });

    function isMobileScreen() {
        return ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth <= 768;
    }

    // --- Swipe navigation for mobile ---
    function setupSwipeNavigation() {
        let startX = 0, startY = 0, endX = 0, endY = 0;
        const threshold = 60; // px required to count as a swipe
        const maxVerticalOffset = 120; // max vertical movement allowed
        let touching = false;

        document.addEventListener('touchstart', function(e) {
            if (e.touches && e.touches.length === 1) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                touching = true;
            }
        }, { passive: true });

        document.addEventListener('touchmove', function(e) {
            if (!touching || !e.touches || e.touches.length !== 1) return;
            endX = e.touches[0].clientX;
            endY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', function(e) {
            if (!touching) return;
            touching = false;
            const dx = endX - startX;
            const dy = endY - startY;
            if (Math.abs(dx) > threshold && Math.abs(dy) < maxVerticalOffset) {
                if (dx < 0) {
                    // swipe left -> next page
                    nextPage();
                } else {
                    // swipe right -> prev page
                    prevPage();
                }
            }
            // reset
            startX = startY = endX = endY = 0;
        }, { passive: true });
    }

    // --- Mobile auto-hide logic for action buttons ---
    function setupMobileAutoHide(buttons = [], idleMs = 3000) {
        if (!isMobileScreen()) {
            // ensure buttons visible on non-mobile
            buttons.forEach(b => {
                b.style.opacity = '1';
                b.style.transform = 'translateY(0)';
                b.style.pointerEvents = 'auto';
            });
            return;
        }

        // set transitions if not already set
        buttons.forEach(btn => {
            btn.style.transition = btn.style.transition || 'opacity 220ms ease, transform 220ms ease';
        });

        let hideTimer = null;
        function showButtons() {
            buttons.forEach(b => {
                b.style.opacity = '1';
                b.style.transform = 'translateY(0)';
                b.style.pointerEvents = 'auto';
            });
            resetHideTimer();
        }

        function hideButtons() {
            buttons.forEach(b => {
                // slide a bit and fade
                b.style.opacity = '0';
                b.style.transform = 'translateY(8px) scale(0.98)';
                b.style.pointerEvents = 'none';
            });
        }

        function resetHideTimer() {
            if (hideTimer) clearTimeout(hideTimer);
            hideTimer = setTimeout(() => {
                hideButtons();
            }, idleMs);
        }

        // Interactions that should show the buttons again
        ['touchstart', 'touchmove', 'touchend', 'scroll'].forEach(evt => {
            document.addEventListener(evt, function _showHandler() {
                showButtons();
            }, { passive: true });
        });

        // Also show when page navigation dots clicked (accessibility)
        document.addEventListener('click', function(e) {
            showButtons();
        });

        // Start the timer
        resetHideTimer();
    }
    
    console.log('6-page resume application initialized successfully - Madwesh J Devadiga');
});