import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="lp-root">
      {/* ── Nav ─────────────────────────────────────────────────── */}
      <header className="lp-nav">
        <div className="lp-nav-inner">
          <span className="lp-logo">ProposalIQ</span>
          <nav className="lp-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
          </nav>
          <div className="lp-nav-actions">
            <button className="lp-btn-ghost" onClick={() => navigate('/login')}>Sign in</button>
            <button className="lp-btn-primary" onClick={() => navigate('/register')}>Get started</button>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-container">
          <div className="lp-hero-badge">Built for architecture &amp; design firms</div>
          <h1 className="lp-hero-title">
            Win more RFPs.<br />Less time writing.
          </h1>
          <p className="lp-hero-sub">
            ProposalIQ turns your RFP documents into polished, firm-specific proposal
            drafts using AI — in minutes, not days. Your team's expertise, amplified.
          </p>
          <div className="lp-hero-ctas">
            <button className="lp-btn-primary lp-btn-lg" onClick={() => navigate('/register')}>
              Start free trial
            </button>
            <button className="lp-btn-outline lp-btn-lg" onClick={() => navigate('/login')}>
              Sign in
            </button>
          </div>
          <p className="lp-hero-note">No credit card required. Set up in under 5 minutes.</p>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section className="lp-features" id="features">
        <div className="lp-container">
          <div className="lp-section-header">
            <h2>Everything your firm needs to respond faster</h2>
            <p>Proposal writing shouldn't take days. ProposalIQ handles the heavy lifting so your principals can focus on winning.</p>
          </div>
          <div className="lp-features-grid">
            <div className="lp-feature-card">
              <div className="lp-feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <h3>Upload any RFP</h3>
              <p>Drop in a PDF or Word document. ProposalIQ parses the full scope of work, requirements, and evaluation criteria automatically.</p>
            </div>

            <div className="lp-feature-card">
              <div className="lp-feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                  <rect x="9" y="3" width="6" height="4" rx="1"/>
                  <line x1="9" y1="12" x2="15" y2="12"/>
                  <line x1="9" y1="16" x2="13" y2="16"/>
                </svg>
              </div>
              <h3>AI draft generation</h3>
              <p>Our AI reads the RFP requirements and generates a tailored proposal draft, drawing from your firm's uploaded knowledge base and past project descriptions.</p>
            </div>

            <div className="lp-feature-card">
              <div className="lp-feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <h3>Review and refine</h3>
              <p>Read through the draft, provide edit instructions in plain English, and ProposalIQ regenerates the relevant sections. Export when you're ready.</p>
            </div>

            <div className="lp-feature-card">
              <div className="lp-feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                </svg>
              </div>
              <h3>Your firm's knowledge base</h3>
              <p>Upload your capabilities statement, past project sheets, and team bios. ProposalIQ uses them to keep every proposal grounded in your firm's real strengths.</p>
            </div>

            <div className="lp-feature-card">
              <div className="lp-feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <h3>Track your proposals</h3>
              <p>Keep all your RFP responses in one place. Review past proposals, monitor submission history, and track your firm's proposal activity over time.</p>
            </div>

            <div className="lp-feature-card">
              <div className="lp-feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3>Save dozens of hours</h3>
              <p>A typical RFP response takes 8–20 hours of principal time. ProposalIQ compresses that to under an hour for the first structured draft.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────── */}
      <section className="lp-how" id="how-it-works">
        <div className="lp-container">
          <div className="lp-section-header">
            <h2>How it works</h2>
            <p>Three steps from RFP to draft proposal.</p>
          </div>
          <div className="lp-steps">
            <div className="lp-step">
              <div className="lp-step-number">01</div>
              <div className="lp-step-body">
                <h3>Upload your RFP document</h3>
                <p>Drag and drop a PDF or Word file. ProposalIQ extracts every requirement, deadline, and evaluation criterion automatically.</p>
              </div>
            </div>
            <div className="lp-step-divider" aria-hidden="true" />
            <div className="lp-step">
              <div className="lp-step-number">02</div>
              <div className="lp-step-body">
                <h3>AI generates a tailored draft</h3>
                <p>Using your firm's knowledge base and the RFP requirements, ProposalIQ produces a structured proposal draft ready for your review.</p>
              </div>
            </div>
            <div className="lp-step-divider" aria-hidden="true" />
            <div className="lp-step">
              <div className="lp-step-number">03</div>
              <div className="lp-step-body">
                <h3>Refine and export</h3>
                <p>Give edit instructions in plain English, review the updated sections, and export your finished proposal document.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────── */}
      <section className="lp-cta-section">
        <div className="lp-container">
          <div className="lp-cta-box">
            <h2>Ready to respond to every RFP faster?</h2>
            <p>Join architecture and design firms that use ProposalIQ to compete for more work without burning out their team.</p>
            <button className="lp-btn-primary lp-btn-lg" onClick={() => navigate('/register')}>
              Start free trial
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-inner">
            <span className="lp-logo">ProposalIQ</span>
            <p className="lp-footer-copy">&copy; {new Date().getFullYear()} ProposalIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
