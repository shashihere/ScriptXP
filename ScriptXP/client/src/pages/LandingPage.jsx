import { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Zap, Trophy, Network, Code2, Sparkles, ArrowRight, BrainCircuit } from 'lucide-react';
import SignUpModal from '../components/SignUpModal';
import LoginModal from '../components/LoginModal';
import './LandingPage.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function LandingPage() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const switchToSignUp = () => { setShowLogin(false); setShowSignUp(true); };
  const switchToLogin = () => { setShowSignUp(false); setShowLogin(true); };

  return (
    <div className="landing-wrapper">
      {/* Dynamic Background */}
      <div className="bg-mesh">
        <div className="mesh-blob blob-1"></div>
        <div className="mesh-blob blob-2"></div>
      </div>
      <div className="bg-grid"></div>

      {/* Navbar */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="navbar glass-panel"
      >
        <div className="nav-brand">
          <div className="logo-box glowing-border">
            <Terminal className="text-gradient" size={24} />
          </div>
          <span className="nav-title title-glow">SCRIPT_XP</span>
        </div>
        <div className="nav-actions">
          <button className="btn-ghost" onClick={() => setShowLogin(true)}>Login</button>
          <button className="btn-primary" onClick={() => setShowSignUp(true)}>Start Free</button>
        </div>
      </motion.nav>

      <main className="landing-main">
        {/* HERO SECTION */}
        <motion.section 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="hero"
        >
          <motion.div variants={fadeUp} className="hero-pill glass-panel font-cursive" style={{ fontSize: '1.2rem', color: 'var(--accent-primary)', marginBottom: '1.5rem', boxShadow: '4px 4px 0 var(--accent-primary)', borderColor: 'var(--accent-primary)' }}>
            <Sparkles size={20} style={{ marginRight: '8px' }} />
            <span>The next generation of developer education</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="hero-title">
            MASTER ALGORITHMS. <br />
            <span className="font-cursive" style={{ fontSize: '1.3em', color: 'var(--accent-secondary)' }}>Evolve Beyond.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="hero-subtitle">
            Gamified learning meets high-octane engineering. Break out of tutorial hell, build your digital skill tree, and dominate the global leaderboards.
          </motion.p>

          <motion.div variants={fadeUp} className="hero-cta-group">
            <button className="btn-primary hero-btn" onClick={() => setShowSignUp(true)}>
              Initialize Journey <ArrowRight size={20} />
            </button>
            <button className="btn-outline hero-btn" onClick={() => setShowLogin(true)}>
              Access Terminal
            </button>
          </motion.div>
        </motion.section>

        {/* BENTO GRID FEATURES */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="bento-container"
        >
          <div className="bento-grid">
            
            {/* Feature 1 - Large */}
            <div className="bento-card bento-large glass-panel glowing-border">
              <div className="bento-illustration">
                <Network size={80} strokeWidth={1} className="illustration-icon purple-glow" />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="bento-pulse-ring"
                ></motion.div>
              </div>
              <div className="bento-content">
                <div className="bento-icon-wrapper"><BrainCircuit size={24} /></div>
                <h3>Cybernetic Skill Trees</h3>
                <p>Visualize your progress through an interconnected web of algorithms, data structures, and system design paradigms.</p>
              </div>
            </div>

            {/* Feature 2 - Small */}
            <div className="bento-card bento-small glass-panel">
              <div className="bento-content">
                <div className="bento-icon-wrapper"><Zap size={24} color="var(--accent-primary)" /></div>
                <h3>Hyper-Responsive Editor</h3>
                <p>Write, run, and benchmark code instantly with zero latency.</p>
              </div>
            </div>

            {/* Feature 3 - Small */}
            <div className="bento-card bento-small glass-panel">
              <div className="bento-content">
                <div className="bento-icon-wrapper"><Code2 size={24} color="var(--accent-tertiary)" /></div>
                <h3>Elite Syntax</h3>
                <p>Learn patterns used by FAANG engineers to solve complex problems.</p>
              </div>
            </div>

            {/* Feature 4 - Medium */}
            <div className="bento-card bento-medium glass-panel">
              <div className="bento-illustration-right">
                <Trophy size={60} strokeWidth={1.5} className="illustration-icon cyan-glow" />
              </div>
              <div className="bento-content">
                <div className="bento-icon-wrapper"><Trophy size={24} color="var(--accent-primary)" /></div>
                <h3>Global Leaderboards</h3>
                <p>Compete in real-time tournaments. Rack up XP, earn achievement badges, and flex your ranking on your public profile.</p>
              </div>
            </div>

          </div>
        </motion.section>
      </main>

      {/* Modals */}
      <SignUpModal
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSwitchToLogin={switchToLogin}
      />
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToSignUp={switchToSignUp}
      />
    </div>
  );
}
