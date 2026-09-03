import React from "react";
import { SearchIcon, UserIcon, CheckCircleIcon } from "./Icons";

function HowItWorks() {
  return (
    <section className="how-section" id="how-it-works">
      <div className="how-container">
        <div className="section-heading" style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
          <p className="section-eyebrow">SIMPLE & SECURE PROCESS</p>
          <h2>How CampusMarket Works</h2>
          <p style={{ color: '#94a3b8', fontSize: 16, marginTop: 12 }}>
            Whether you need help with assignments, event creative assets, or practical support, getting started takes less than a minute.
          </p>
        </div>

        <div className="steps-grid">
          <article className="step-card">
            <div className="step-number-badge">
              <SearchIcon style={{ width: 22, height: 22 }} />
            </div>
            <h3>1. Discover Services</h3>
            <p>
              Browse categorized listings offered by verified students across your campus. Filter by category, price, or search for specific skills.
            </p>
          </article>

          <article className="step-card">
            <div className="step-number-badge">
              <UserIcon style={{ width: 22, height: 22 }} />
            </div>
            <h3>2. Connect & Request</h3>
            <p>
              Send service requests directly to student providers. Communicate details, schedule completion times, and agree on expectations.
            </p>
          </article>

          <article className="step-card">
            <div className="step-number-badge">
              <CheckCircleIcon style={{ width: 22, height: 22 }} />
            </div>
            <h3>3. Complete & Rate</h3>
            <p>
              Get your work delivered with quality and peace of mind. Build your campus reputation and leave helpful community reviews.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;