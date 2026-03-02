import React, { useEffect, useState } from 'react';
import { getStats, getStory, getTeam, getValues } from '../api/contentService';
import './About.css';

const fallbackStats = [
  { number: '5000+', label: 'Happy Clients' },
  { number: '10K+', label: 'Signs Created' },
  { number: '15+', label: 'Years Experience' },
  { number: '50+', label: 'Countries Served' },
];

const fallbackTeam = [
  { name: 'Arsen Asatryan', role: 'Founder & Creative Director', emoji: '👩‍🎨' },
  { name: 'Mike Chen', role: 'Lead Designer', emoji: '👨‍💻' },
  { name: 'Emma Davis', role: 'Production Manager', emoji: '👩‍🔧' },
  { name: 'Alex Rivera', role: 'Customer Success', emoji: '👨‍💼' },
];

const fallbackValues = [
  {
    icon: '💡',
    title: 'Innovation',
    description: 'We use cutting-edge LED neon technology to create stunning, energy-efficient signs.',
  },
  {
    icon: '🎯',
    title: 'Quality',
    description: 'Every sign is handcrafted with premium materials and undergoes rigorous quality checks.',
  },
  {
    icon: '❤️',
    title: 'Passion',
    description: 'We love what we do, and it shows in every custom neon sign we create.',
  },
  {
    icon: '🌟',
    title: 'Customer First',
    description: 'Your satisfaction is our priority. We go above and beyond for every client.',
  },
];

const fallbackStory = [
  'Founded in 2009, Flex Neon began with a simple mission: to make custom neon signs accessible to everyone. What started as a small workshop has grown into a leading custom neon sign company, serving clients worldwide.',
  "We specialize in creating stunning, handcrafted LED neon signs that transform spaces and bring visions to life. From businesses looking to make a statement to couples celebrating their special day, we've illuminated countless memorable moments.",
  'Our commitment to quality craftsmanship, innovative design, and exceptional customer service has made us the go-to choice for custom neon signs. Every piece we create is a testament to our passion for the art of neon.',
];

const sortAndFilterActive = (items) => items
  .filter((item) => item?.active !== false)
  .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

function About() {
  const [stats, setStats] = useState(fallbackStats);
  const [team, setTeam] = useState(fallbackTeam);
  const [values, setValues] = useState(fallbackValues);
  const [storyParagraphs, setStoryParagraphs] = useState(fallbackStory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [statsRes, teamRes, valuesRes, storyRes] = await Promise.all([
          getStats(),
          getTeam(),
          getValues(),
          getStory(),
        ]);

        const apiStats = Array.isArray(statsRes.data) ? sortAndFilterActive(statsRes.data) : [];
        const apiTeam = Array.isArray(teamRes.data) ? sortAndFilterActive(teamRes.data) : [];
        const apiValues = Array.isArray(valuesRes.data) ? sortAndFilterActive(valuesRes.data) : [];
        const apiStory = Array.isArray(storyRes.data) ? sortAndFilterActive(storyRes.data) : [];

        if (apiStats.length) {
          setStats(apiStats.map((item) => ({ number: item.number || item.value || '', label: item.label || item.title || '' })));
        }

        if (apiTeam.length) {
          setTeam(apiTeam.map((item) => ({
            name: item.name || 'Team Member',
            role: item.role || '',
            emoji: item.emoji || '👤',
          })));
        }

        if (apiValues.length) {
          setValues(apiValues.map((item) => ({
            icon: item.icon || '✨',
            title: item.title || 'Value',
            description: item.description || '',
          })));
        }

        if (apiStory.length) {
          const paragraphs = apiStory
            .map((item) => item.content || item.description || item.text || '')
            .filter(Boolean);

          if (paragraphs.length) {
            setStoryParagraphs(paragraphs);
          }
        }
      } catch (error) {
        console.error('Failed to load about content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="about">
      <div className="about-container">
        <div className="about-hero">
          <h1 className="about-title">
            <span className="neon-text" style={{ color: 'var(--neon-pink)' }}>About Us</span>
          </h1>
          <p className="about-lead">
            Bringing Light to Life Since 2009
          </p>
        </div>

        <section className="about-story">
          <div className="story-content">
            <h2 className="section-heading neon-text" style={{ color: 'var(--neon-blue)' }}>
              Our Story
            </h2>
            <div className="story-text">
              {storyParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

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
