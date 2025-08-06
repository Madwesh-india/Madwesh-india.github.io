// Resume Page Navigation
document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 1;
    const totalPages = 2;
    
    // Get DOM elements
    const page1 = document.getElementById('page-1');
    const page2 = document.getElementById('page-2');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const pageIndicator = document.getElementById('current-page');
    
    // Navigation functions
    function showPage(pageNumber) {
        // Hide all pages
        page1.style.display = 'none';
        page2.style.display = 'none';
        
        // Show requested page
        if (pageNumber === 1) {
            page1.style.display = 'flex';
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'inline-flex';
        } else if (pageNumber === 2) {
            page2.style.display = 'flex';
            prevBtn.style.display = 'inline-flex';
            nextBtn.style.display = 'none';
        }
        
        // Update page indicator
        pageIndicator.textContent = `Page ${pageNumber} of ${totalPages}`;
        currentPage = pageNumber;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
    
    // Add event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            nextPage();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            prevPage();
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === 'PageDown') {
            e.preventDefault();
            nextPage();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            e.preventDefault();
            prevPage();
        }
    });
    
    // Initialize first page
    showPage(1);
    
    // Print functionality - Fixed version
    function setupPrint() {
        // Create print button
        const printBtn = document.createElement('button');
        printBtn.className = 'btn btn--outline no-print';
        printBtn.innerHTML = '🖨️ Print Resume';
        printBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            font-size: 14px;
            padding: 8px 12px;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            color: var(--color-text);
            border-radius: var(--radius-base);
            cursor: pointer;
        `;
        
        // Print button click handler
        printBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Show both pages before printing
            const originalPage1Display = page1.style.display;
            const originalPage2Display = page2.style.display;
            
            // Make both pages visible
            page1.style.display = 'flex';
            page2.style.display = 'flex';
            
            // Remove any transitions or transforms
            page1.style.transition = 'none';
            page2.style.transition = 'none';
            page1.style.transform = 'none';
            page2.style.transform = 'none';
            page1.style.opacity = '1';
            page2.style.opacity = '1';
            
            // Trigger print
            setTimeout(function() {
                try {
                    window.print();
                } catch (error) {
                    console.log('Print failed:', error);
                    // Fallback: try to open print dialog manually
                    document.execCommand('print');
                }
                
                // Restore original display after a short delay
                setTimeout(function() {
                    page1.style.display = originalPage1Display;
                    page2.style.display = originalPage2Display;
                    page1.style.transition = '';
                    page2.style.transition = '';
                }, 500);
            }, 100);
        });
        
        document.body.appendChild(printBtn);
        
        // Handle browser print events
        window.addEventListener('beforeprint', function() {
            // Ensure both pages are visible when printing
            page1.style.display = 'flex';
            page2.style.display = 'flex';
            page1.style.opacity = '1';
            page2.style.opacity = '1';
            page1.style.transform = 'none';
            page2.style.transform = 'none';
        });
        
        window.addEventListener('afterprint', function() {
            // Restore current page view after printing
            setTimeout(function() {
                showPage(currentPage);
            }, 100);
        });
    }
    
    // Theme toggle functionality
    function setupTheme() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'btn btn--outline no-print';
        themeToggle.innerHTML = '🌙';
        themeToggle.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            color: var(--color-text);
            cursor: pointer;
        `;
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-color-scheme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-color-scheme', newTheme);
            themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
            
            // Save preference (if localStorage is available)
            try {
                localStorage.setItem('resume-theme', newTheme);
            } catch (e) {
                // localStorage not available, continue without saving
            }
        });
        
        // Load saved theme (if localStorage is available)
        try {
            const savedTheme = localStorage.getItem('resume-theme');
            if (savedTheme) {
                document.documentElement.setAttribute('data-color-scheme', savedTheme);
                themeToggle.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
            }
        } catch (e) {
            // localStorage not available, use default theme
        }
        
        document.body.appendChild(themeToggle);
    }
    
    // Contact interactions
    function setupContactInteractions() {
        const contactElements = document.querySelectorAll('.contact-row span');
        
        contactElements.forEach(function(element) {
            const text = element.textContent;
            
            // Make email clickable
            if (text.includes('@')) {
                element.style.cursor = 'pointer';
                element.style.textDecoration = 'underline';
                element.addEventListener('click', function() {
                    const email = text.replace('📧 ', '');
                    window.open('mailto:' + email, '_blank');
                });
            }
            
            // Make LinkedIn clickable
            if (text.includes('linkedin.com')) {
                element.style.cursor = 'pointer';
                element.style.textDecoration = 'underline';
                element.addEventListener('click', function() {
                    const linkedin = text.replace('💼 ', '');
                    window.open('https://' + linkedin, '_blank');
                });
            }
            
            // Make GitHub clickable
            if (text.includes('github.com')) {
                element.style.cursor = 'pointer';
                element.style.textDecoration = 'underline';
                element.addEventListener('click', function() {
                    const github = text.replace('🔗 ', '');
                    window.open('https://' + github, '_blank');
                });
            }
            
            // Add copy to clipboard on double click
            element.addEventListener('dblclick', function() {
                const textToCopy = text.replace(/^[📧📱📍💼🔗] /, '');
                
                // Try to copy to clipboard
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(textToCopy).then(function() {
                        showCopyFeedback(element);
                    }).catch(function() {
                        // Fallback for older browsers
                        fallbackCopy(textToCopy, element);
                    });
                } else {
                    fallbackCopy(textToCopy, element);
                }
            });
        });
    }
    
    function fallbackCopy(text, element) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showCopyFeedback(element);
        } catch (err) {
            console.log('Copy failed');
        }
        
        document.body.removeChild(textArea);
    }
    
    function showCopyFeedback(element) {
        const originalText = element.textContent;
        element.textContent = '✓ Copied!';
        element.style.color = 'var(--color-success)';
        
        setTimeout(function() {
            element.textContent = originalText;
            element.style.color = '';
        }, 2000);
    }
    
    // Add accessibility improvements
    function setupAccessibility() {
        // Add ARIA labels
        if (nextBtn) nextBtn.setAttribute('aria-label', 'Go to next page of resume');
        if (prevBtn) prevBtn.setAttribute('aria-label', 'Go to previous page of resume');
        
        // Add page landmarks
        page1.setAttribute('aria-label', 'Resume page 1 of 2: Summary, Skills, Education');
        page2.setAttribute('aria-label', 'Resume page 2 of 2: Experience and Projects');
        
        // Add role attributes
        page1.setAttribute('role', 'main');
        page2.setAttribute('role', 'main');
        
        // Add skip links for better accessibility
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only';
        skipLink.style.cssText = `
            position: absolute;
            left: -9999px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        
        skipLink.addEventListener('focus', function() {
            skipLink.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                background: var(--color-primary);
                color: var(--color-btn-primary-text);
                padding: 8px 12px;
                border-radius: 4px;
                text-decoration: none;
                z-index: 9999;
            `;
        });
        
        skipLink.addEventListener('blur', function() {
            skipLink.style.cssText = `
                position: absolute;
                left: -9999px;
                width: 1px;
                height: 1px;
                overflow: hidden;
            `;
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // Initialize all functionality
    setupPrint();
    setupTheme();
    setupContactInteractions();
    setupAccessibility();
    
    // Add smooth loading animation
    document.body.style.opacity = '0';
    setTimeout(function() {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('Resume application initialized successfully');
});