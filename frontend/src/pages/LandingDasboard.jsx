// frontend/src/pages/LandingDashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaChartLine, FaShieldAlt, FaUsers, FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaGithub } from 'react-icons/fa';
import './LandingDashboard.css';

export default function LandingDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRegisterClick = () => {
    // Navigate to login page and trigger register form
    navigate('/login', { state: { showRegister: true } });
  };

  return (
    <div className="landing-container">
      {/* Navigation Bar */}
      <nav className="landing-navbar">
        <div className="nav-logo">
          <FaGraduationCap size={32} color="#ED1C24" />
          <h2>LUCT Reporting System</h2>
        </div>
        
        <div className="nav-menu">
          <button onClick={() => scrollToSection('home')} className="nav-link">Home</button>
          <button onClick={() => scrollToSection('about')} className="nav-link">About</button>
          <button onClick={() => scrollToSection('features')} className="nav-link">Features</button>
          <button onClick={() => scrollToSection('university')} className="nav-link">University</button>
          <button onClick={() => scrollToSection('contact')} className="nav-link">Contact</button>
          
          <div className="nav-auth-buttons">
            <button onClick={() => navigate('/login')} className="btn-login">Login</button>
            <button onClick={handleRegisterClick} className="btn-register">Register</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <h1 className="hero-title">Welcome to LUCT Reporting System</h1>
        <p className="hero-subtitle">"Empowerment builds nations."</p>
        <p className="hero-description">
          A comprehensive digital platform designed to streamline academic monitoring, 
          feedback, and support for students and staff at Limkokwing University of Creative Technology.
        </p>
        <div className="hero-buttons">
          <button onClick={() => navigate('/login')} className="btn-primary">Get Started</button>
          <button onClick={() => scrollToSection('about')} className="btn-secondary">Learn More</button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-container">
          <h2 className="section-heading">About This System</h2>
          <div className="info-cards-grid">
            <InfoCard 
              icon={<FaChartLine size={40} />}
              title="Academic Monitoring"
              description="Track attendance, submissions, and academic progress in real-time with comprehensive analytics and reporting tools."
            />
            <InfoCard 
              icon={<FaUsers size={40} />}
              title="Collaborative Platform"
              description="Seamless communication between students, lecturers, principal lecturers, and program leaders for enhanced educational outcomes."
            />
            <InfoCard 
              icon={<FaShieldAlt size={40} />}
              title="Secure & Reliable"
              description="Built with security first - role-based access control ensures your data is protected and accessible only to authorized users."
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <h2 className="section-heading">Key Features</h2>
          <div className="features-grid">
            <FeatureCard 
              title="Student Portal"
              features={[
                'Mark attendance for classes',
                'Submit complaints and reports to PRLs',
                'Rate lecturers and courses',
                'View attendance history',
                'Track complaint responses'
              ]}
            />
            <FeatureCard 
              title="Lecturer Portal"
              features={[
                'Submit daily class reports',
                'Monitor student attendance',
                'View and respond to feedback',
                'Access class schedules',
                'Rate Principal Lecturers'
              ]}
            />
            <FeatureCard 
              title="Principal Lecturer Portal"
              features={[
                'Review lecturer reports',
                'Respond to student complaints',
                'Monitor lecturer performance',
                'Provide feedback to lecturers',
                'Export reports for analysis'
              ]}
            />
            <FeatureCard 
              title="Program Leader Portal"
              features={[
                'System-wide monitoring',
                'View all reports and ratings',
                'Manage streams and modules',
                'Oversee lecturer assignments',
                'Generate comprehensive analytics'
              ]}
            />
          </div>
        </div>
      </section>

      {/* University Section */}
      <section id="university" className="university-section">
        <div className="section-container">
          <h2 className="section-heading">About Limkokwing University Lesotho</h2>
          <div className="university-content">
            <p className="university-description">
              Limkokwing University of Creative Technology (LUCT) is a private international university with a presence 
              across Africa, Europe, and Asia. The Lesotho campus is committed to providing world-class education in 
              creative arts, technology, and business.
            </p>
            
            <div className="stats-grid">
              <StatCard number="1000+" label="Students Enrolled" />
              <StatCard number="50+" label="Academic Programs" />
              <StatCard number="100+" label="Expert Lecturers" />
              <StatCard number="10+" label="Years of Excellence" />
            </div>

            <div className="vision-mission">
              <div className="vision">
                <h3>Our Vision</h3>
                <p>
                  To be a leading university that empowers students with knowledge, skills, and innovation to become 
                  leaders in their respective fields and contribute to nation-building.
                </p>
              </div>
              
              <div className="mission">
                <h3>Our Mission</h3>
                <p>
                  To provide quality education that combines creativity, technology, and entrepreneurship, preparing 
                  students for the global marketplace while preserving cultural values.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="section-container">
          <h2 className="section-heading">Contact Us</h2>
          <div className="contact-grid">
            <ContactCard 
              icon={<FaMapMarkerAlt size={30} />}
              title="Address"
              info="Limkokwing University, Maseru, Lesotho"
            />
            <ContactCard 
              icon={<FaPhone size={30} />}
              title="Phone"
              info="+266 2231 2156"
            />
            <ContactCard 
              icon={<FaEnvelope size={30} />}
              title="Email"
              info="info@limkokwing.ac.ls"
            />
          </div>

          <div className="developer-info">
            <h3>System Developer</h3>
            <p>Divine Chukwudi (etern.pptx)</p>
            <div className="social-links">
              <a href="https://www.linkedin.com/in/divinechukwudi" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaLinkedin size={24} /> LinkedIn
              </a>
              <a href="https://github.com/DivineChukwudi" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaGithub size={24} /> GitHub
              </a>
              <a href="mailto:chukwudidivine20@gmail.com" className="social-link">
                <FaEnvelope size={24} /> Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} LUCT Reporting System. All rights reserved.</p>
        <p>System designed by etern.pptx | Divine Chukwudi</p>
      </footer>
    </div>
  );
}

// Component: InfoCard
function InfoCard({ icon, title, description }) {
  return (
    <div className="info-card">
      <div className="info-card-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

// Component: FeatureCard
function FeatureCard({ title, features }) {
  return (
    <div className="feature-card">
      <h3>{title}</h3>
      <ul>
        {features.map((feature, index) => (
          <li key={index}>
            <span className="check-icon">✓</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Component: StatCard
function StatCard({ number, label }) {
  return (
    <div className="stat-card">
      <div className="stat-number">{number}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// Component: ContactCard
function ContactCard({ icon, title, info }) {
  return (
    <div className="contact-card">
      <div className="contact-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{info}</p>
    </div>
  );
}