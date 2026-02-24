import React from 'react';
import './About.css';

function About() {
  const stats = [
    { number: '5000+', label: 'Happy Clients' },
    { number: '10K+', label: 'Signs Created' },
    { number: '15+', label: 'Years Experience' },
    { number: '50+', label: 'Countries Served' }
  ];

  const team = [
    { name: 'Arsen Asatryan', role: 'Founder & Creative Director', emoji: '👩‍🎨' },
    { name: 'Mike Chen', role: 'Lead Designer', emoji: '👨‍💻' },
    { name: 'Emma Davis', role: 'Production Manager', emoji: '👩‍🔧' },
    { name: 'Alex Rivera', role: 'Customer Success', emoji: '👨‍💼' }
  ];

  const values = [
    {
      icon: '💡',
      title: 'Innovation',
      description: 'We use cutting-edge LED neon technology to create stunning, energy-efficient signs.'
    },
    {
      icon: '🎯',
      title: 'Quality',
      description: 'Every sign is handcrafted with premium materials and undergoes rigorous quality checks.'
    },
    {
      icon: '❤️',
      title: 'Passion',
      description: 'We love what we do, and it shows in every custom neon sign we create.'
    },
    {
      icon: '🌟',
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We go above and beyond for every client.'
    }
  ];

  return (
    <div className="about">
      <div className="about-container">
        {/* Hero Section */}
        <div className="about-hero">
          <h1 className="about-title">
            <span className="neon-text" style={{ color: 'var(--neon-pink)' }}>About Us</span>
          </h1>
          <p className="about-lead">
            Bringing Light to Life Since 2009
          </p>
        </div>

        {/* Story Section */}
        <section className="about-story">
          <div className="story-content">
            <h2 className="section-heading neon-text" style={{ color: 'var(--neon-blue)' }}>
              Our Story
            </h2>
            <div className="story-text">
              <p>
                Founded in 2009, Flex Neon began with a simple mission: to make custom neon signs accessible to everyone. What started as a small workshop has grown into a leading custom neon sign company, serving clients worldwide.
              </p>
              <p>
                We specialize in creating stunning, handcrafted LED neon signs that transform spaces and bring visions to life. From businesses looking to make a statement to couples celebrating their special day, we've illuminated countless memorable moments.
              </p>
              <p>
                Our commitment to quality craftsmanship, innovative design, and exceptional customer service has made us the go-to choice for custom neon signs. Every piece we create is a testament to our passion for the art of neon.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="about-stats">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number neon-text" style={{ color: 'var(--neon-pink)' }}>
                  {stat.number}
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="about-values">
          <h2 className="section-heading neon-text" style={{ color: 'var(--neon-purple)' }}>
            Our Values
          </h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="about-team">
          <h2 className="section-heading neon-text" style={{ color: 'var(--neon-green)' }}>
            Meet Our Team
          </h2>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">{member.emoji}</div>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-cta">
          <div className="cta-box">
            <h2 className="cta-title neon-text" style={{ color: 'var(--neon-pink)' }}>
              Ready to Work With Us?
            </h2>
            <p className="cta-text">
              Let's create something amazing together
            </p>
            <button className="neon-button" onClick={() => window.location.href = '/contact'}>
              Get In Touch
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
