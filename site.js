// Service cards hover effect
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animations
        document.querySelectorAll('.service-card, .about-text, .powerbi-container, .experience-card, .connect-card, .link-card, .nexgen-video-panel').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Table row expansion functionality (methodology scoring table)
        document.querySelectorAll('.clickable-row').forEach(row => {
            row.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const detailRow = document.getElementById(targetId);
                const isActive = this.classList.contains('active');
                
                // Close all detail rows and remove active class from all clickable rows
                document.querySelectorAll('.clickable-row').forEach(r => r.classList.remove('active'));
                document.querySelectorAll('.table-detail-row').forEach(r => r.classList.remove('active'));
                
                // Open clicked row's details if it wasn't already open
                if (!isActive) {
                    this.classList.add('active');
                    detailRow.classList.add('active');
                }
            });
        });

        // Mobile Menu Toggle
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });

        // Mobile dropdown toggle
        document.querySelectorAll('.nav-dropdown > .nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    this.parentElement.classList.toggle('active');
                }
            });
        });

        // Smooth scrolling with offset for fixed nav
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const navHeight = 70; // Height of fixed nav
                    const targetPosition = target.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
