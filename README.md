<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data Glass LLC - Federal FOIA Data Solutions</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* Header */
        header {
            background: #fff;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
            transition: all 0.3s ease;
        }

        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
        }

        .logo {
            font-size: 1.8rem;
            font-weight: 700;
            color: #2c3e50;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .logo::before {
            content: "🔍";
            font-size: 1.5rem;
        }

        .nav-links {
            display: flex;
            list-style: none;
            gap: 2rem;
        }

        .nav-links a {
            text-decoration: none;
            color: #555;
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .nav-links a:hover {
            color: #3498db;
        }

        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 80px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><polygon fill="rgba(255,255,255,0.05)" points="0,1000 1000,800 1000,1000"/></svg>');
            background-size: cover;
        }

        .hero-content {
            position: relative;
            z-index: 1;
        }

        .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 1rem;
            font-weight: 700;
            opacity: 0;
            animation: fadeInUp 1s ease forwards;
        }

        .hero p {
            font-size: 1.3rem;
            margin-bottom: 2rem;
            opacity: 0.9;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            opacity: 0;
            animation: fadeInUp 1s ease 0.3s forwards;
        }

        .cta-button {
            display: inline-block;
            background: #e74c3c;
            color: white;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
            opacity: 0;
            animation: fadeInUp 1s ease 0.6s forwards;
        }

        .cta-button:hover {
            background: #c0392b;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
        }

        /* Power BI Section */
        .powerbi-section {
            padding: 80px 0;
            background: #f8f9fa;
        }

        .section-title {
            text-align: center;
            margin-bottom: 3rem;
        }

        .section-title h2 {
            font-size: 2.8rem;
            color: #2c3e50;
            margin-bottom: 1rem;
        }

        .section-title p {
            font-size: 1.2rem;
            color: #666;
            max-width: 600px;
            margin: 0 auto;
        }

        .powerbi-container {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            text-align: center;
            min-height: 400px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .powerbi-placeholder {
            color: #666;
            font-size: 1.2rem;
            border: 2px dashed #ddd;
            padding: 3rem;
            border-radius: 10px;
            width: 100%;
        }

        .powerbi-placeholder h3 {
            color: #2c3e50;
            margin-bottom: 1rem;
        }

        /* About Section */
        .about {
            padding: 80px 0;
            background: white;
        }

        .about-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
        }

        .about-text h2 {
            font-size: 2.5rem;
            color: #2c3e50;
            margin-bottom: 1.5rem;
        }

        .about-text p {
            color: #666;
            margin-bottom: 1.5rem;
            font-size: 1.1rem;
        }

        .about-image {
            position: relative;
        }

        .about-image::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 15px;
            opacity: 0.1;
        }

        /* Services Section */
        .services {
            padding: 80px 0;
            background: #f8f9fa;
        }

        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .service-card {
            background: white;
            padding: 2.5rem;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }

        .service-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .service-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }

        .service-card h3 {
            font-size: 1.5rem;
            color: #2c3e50;
            margin-bottom: 1rem;
        }

        .service-card p {
            color: #666;
            line-height: 1.6;
        }

        /* Experience Section */
        .experience {
            padding: 80px 0;
            background: white;
        }

        .experience-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .experience-card {
            background: #f8f9fa;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            transition: all 0.3s ease;
            border-left: 4px solid #3498db;
        }

        .experience-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 35px rgba(52, 152, 219, 0.1);
            background: white;
        }

        .experience-logo {
            margin-bottom: 1.5rem;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .logo-img {
            max-height: 70px;
            max-width: 70px;
            object-fit: contain;
            filter: grayscale(20%);
            transition: filter 0.3s ease;
        }

        .experience-card:hover .logo-img {
            filter: grayscale(0%);
        }

        .custom-logo {
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            font-weight: 700;
            color: white;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .experience-card h3 {
            font-size: 1.3rem;
            color: #2c3e50;
            margin-bottom: 0.5rem;
        }

        .experience-card h4 {
            font-size: 1rem;
            color: #3498db;
            font-weight: 600;
            margin-bottom: 1rem;
        }

        .experience-card p {
            color: #666;
            line-height: 1.6;
            font-size: 0.95rem;
        }

        /* Connect Section */
        .connect-section {
            padding: 80px 0;
            background: #f8f9fa;
        }

        .connect-content {
            display: flex;
            justify-content: center;
            margin-top: 3rem;
        }

        .connect-card {
            background: white;
            padding: 3rem;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-width: 400px;
            transition: all 0.3s ease;
        }

        .connect-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .connect-icon {
            font-size: 3rem;
            margin-bottom: 1.5rem;
        }

        .connect-card h3 {
            font-size: 1.8rem;
            color: #2c3e50;
            margin-bottom: 1rem;
        }

        .connect-card p {
            color: #666;
            margin-bottom: 2rem;
            line-height: 1.6;
        }

        .connect-link {
            display: inline-block;
            background: #0077b5;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .connect-link:hover {
            background: #005885;
            transform: translateY(-2px);
        }

        /* Footer */
        footer {
            background: #2c3e50;
            color: white;
            padding: 60px 0 30px;
        }

        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
        }

        .footer-section h3 {
            margin-bottom: 1rem;
            color: #3498db;
        }

        .footer-section p, .footer-section a {
            color: #bdc3c7;
            text-decoration: none;
            margin-bottom: 0.5rem;
            display: block;
        }

        .footer-section a:hover {
            color: #3498db;
        }

        .footer-bottom {
            text-align: center;
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid #34495e;
            color: #95a5a6;
        }

        /* Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }

            .hero h1 {
                font-size: 2.5rem;
            }

            .hero p {
                font-size: 1.1rem;
            }

            .about-content {
                grid-template-columns: 1fr;
                gap: 2rem;
            }

            .section-title h2 {
                font-size: 2.2rem;
            }
        }
    </style>
</head>
<body>
    <main>
        <section id="home" class="hero">
            <div class="container">
                <div class="hero-content">
                    <h1>Data Glass</h1>
                    <h2 style="font-size: 2.2rem; margin-bottom: 1rem; font-weight: 500; opacity: 0; animation: fadeInUp 1s ease 0.2s forwards;">Federal FOIA Data Solutions</h2>
                    <p>Transforming government transparency through advanced data analysis</p>
                </div>
            </div>
        </section>

        <section id="analytics" class="powerbi-section">
            <div class="container">
                <div class="section-title">
                    <h2>FOIA Analytics Dashboard</h2>
                    <p>Interactive insights from federal data sources</p>
                </div>
                <div class="powerbi-container">
                    <div class="powerbi-placeholder">
                        <h3>🚀 Dynamic FOIA Analytic Reporting Tool</h3>
                        <p><strong>Coming Soon</strong></p>
                        <p>Interactive federal data insights and real-time FOIA analytics dashboard will be available here.</p>
                        <p style="font-size: 1rem; margin-top: 2rem; color: #667eea;">
                            Stay tuned for cutting-edge government data visualization and analysis tools.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section id="about" class="about">
            <div class="container">
                <div class="section-title">
                    <h2>About Me</h2>
                    <p>Federal FOIA expertise with deep government experience</p>
                </div>
                <div class="about-content">
                    <div class="about-text">
                        <p>As the primary data analyst for FOIA at the Department of Veterans Affairs, I've developed unparalleled expertise in navigating the complexities of federal transparency requirements and extracting actionable insights from government datasets.</p>
                        <p>My hands-on experience with VA FOIA operations has given me unique insight into the challenges federal agencies face—from data validation and process optimization to meeting transparency mandates while protecting sensitive information.</p>
                        <p>I leverage cutting-edge technology and AI to transform how agencies approach FOIA data. Rather than treating transparency as a compliance burden, I help organizations discover the strategic value hidden in their information assets and use data-driven decisions to modernize their FOIA processes and technology infrastructure.</p>
                        <p>When federal agencies work with Data Glass, they get more than consulting—they get a partner who understands government operations from the inside and delivers measurable improvements to both transparency and efficiency.</p>
                    </div>
                    <div class="about-image">
                        <div style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); height: 300px; border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: 4rem; color: #667eea;">🏛️</div>
                    </div>
                </div>
            </div>
        </section>

        <section id="services" class="services">
            <div class="container">
                <div class="section-title">
                    <h2>Services Offered</h2>
                    <p>Comprehensive FOIA data solutions to illuminate government operations and enhance transparency</p>
                </div>
                <div class="services-grid">
                    <div class="service-card">
                        <div class="service-icon">📊</div>
                        <h3>Federal FOIA Analytics</h3>
                        <p>Advanced analytical techniques to extract meaningful insights from federal datasets and Freedom of Information Act releases.</p>
                    </div>
                    <div class="service-card">
                        <div class="service-icon">📈</div>
                        <h3>Custom Reporting</h3>
                        <p>Tailored reports and visualizations that transform complex government data into actionable business intelligence.</p>
                    </div>
                    <div class="service-card">
                        <div class="service-icon">🔍</div>
                        <h3>Data Consulting</h3>
                        <p>Expert guidance through federal data processes, from FOIA requests to data interpretation and strategic implementation.</p>
                    </div>
                    <div class="service-card">
                        <div class="service-icon">🎯</div>
                        <h3>Strategic Intelligence</h3>
                        <p>Market intelligence and competitive analysis derived from federal data sources and government information.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="experience" class="experience">
            <div class="container">
                <div class="section-title">
                    <h2>Professional Experience & Education</h2>
                    <p>A foundation built on federal service, education, and data expertise</p>
                </div>
                <div class="experience-grid">
                    <div class="experience-card">
                        <div class="experience-logo">
                            <div class="custom-logo">DG</div>
                        </div>
                        <h3>Data Glass LLC</h3>
                        <h4>Federal FOIA Solutions | 2025-Present</h4>
                        <p>Leveraging government experience to transform federal data challenges into strategic opportunities through advanced analytics, AI-driven insights, and FOIA process optimization for agencies nationwide.</p>
                    </div>
                    <div class="experience-card">
                        <div class="experience-logo">
                            <img src="VA Seal.svg.png" alt="Department of Veterans Affairs" class="logo-img">
                        </div>
                        <h3>Department of Veterans Affairs</h3>
                        <h4>Functional Analyst: Compliance Risk & Remediation | 2024-2025</h4>
                        <p>Primary database administrator for VA's enterprise FOIA program, equipping VA stakeholders with data-driven decision-making tools and strengthening FOIA operational efficiency and organizational planning.</p>
                    </div>
                    <div class="experience-card">
                        <div class="experience-logo">
                            <img src="American_Eagles_logo.svg.png" alt="American University" class="logo-img">
                        </div>
                        <h3>American University</h3>
                        <h4>Kogod School of Business | Washington, D.C.</h4>
                        <p><strong>Bachelor of Science in Business Administration</strong></p>
                        <p>Key Coursework:<br>
                        • School of Public Affairs: Public Affairs Advocacy Institute<br>
                        • Database Management & Statistical Applications<br>
                        • Data Modelling & Analysis<br>
                        • Business Intelligence & Analytics</p>
                    </div>
                    <div class="experience-card">
                        <div class="experience-logo">
                            <img src="Army Seal.svg.png" alt="US Army" class="logo-img">
                        </div>
                        <h3>United States Army</h3>
                        <h4>Avionic Equipment Repairer | 2013-2017</h4>
                        <p>Engaged in multinational exercises and supported missions with foreign allies, supporting operations across the globe.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="connect-section">
            <div class="container">
                <div class="section-title">
                    <h2>Connect With Me</h2>
                    <p>Let's discuss how federal data can drive your organization's success</p>
                </div>
                <div class="connect-content">
                    <div class="connect-card">
                        <div class="connect-icon">🔗</div>
                        <h3>LinkedIn</h3>
                        <p>Connect with me on LinkedIn to discuss FOIA data opportunities and federal transparency initiatives.</p>
                        <a href="https://www.linkedin.com/in/joelkarsevar/" target="_blank" class="connect-link">View LinkedIn Profile</a>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer id="contact">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Data Glass LLC</h3>
                    <p>Federal FOIA Data Solutions</p>
                    <p>Transforming government transparency through data</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 Data Glass LLC. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        // Smooth scrolling for navigation links (if any exist)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

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
        document.querySelectorAll('.service-card, .about-text, .powerbi-container, .experience-card, .connect-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    </script>
</body>
</html>
