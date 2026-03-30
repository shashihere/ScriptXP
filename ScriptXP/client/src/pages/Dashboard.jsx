import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, BookOpen, Swords, Trophy, Settings, LogOut, Code2, Zap, Shield, Star, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import XPNotification from '../components/XPNotification';
import ClassSelector from '../components/ClassSelector';
import SkillTree from '../components/SkillTree';
import Leaderboard from '../components/Leaderboard';
import ChallengeInterface from '../components/ChallengeInterface';
import BadgeShowcase from '../components/BadgeShowcase';
import SettingsPanel from '../components/SettingsPanel';
import IDEInterface from '../components/IDEInterface';
import './Dashboard.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Dashboard() {
  const { user, isNewUser, clearNewUser, logout } = useAuth();
  const [showXP, setShowXP] = useState(false);
  const [showClassPrompt, setShowClassPrompt] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (isNewUser) {
      const timer = setTimeout(() => setShowXP(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isNewUser]);

  useEffect(() => {
    if (showXP) {
      const timer = setTimeout(() => {
        clearNewUser();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showXP, clearNewUser]);

  const xpPercent = user ? Math.min((user.xp % 1000) / 10, 100) : 0;
  const nextLevelXP = user ? Math.ceil(user.xp / 1000) * 1000 : 1000;

  return (
    <div className="dashboard-wrapper">
      <div className="bg-mesh">
        <div className="mesh-blob blob-3"></div>
      </div>
      <XPNotification amount={100} message="Welcome Bonus!" show={showXP} />

      {/* Cyberpunk Sidebar */}
      <aside className="sidebar glass-panel glowing-border-right">
        <div className="sidebar-brand">
          <div className="logo-box">
            <Code2 className="text-gradient" size={24} />
          </div>
          <span className="sidebar-name title-glow">SCRIPT_XP</span>
        </div>

        <nav className="sidebar-nav">
          <button onClick={() => setActiveTab('dashboard')} className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> <span className="nav-label">Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('courses')} className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}>
            <BookOpen size={20} /> <span className="nav-label">Courses</span>
          </button>
          <button onClick={() => setActiveTab('challenges')} className={`nav-item ${activeTab === 'challenges' ? 'active' : ''}`}>
            <Swords size={20} /> <span className="nav-label">Challenges</span>
          </button>
          <button onClick={() => setActiveTab('ide')} className={`nav-item ${activeTab === 'ide' ? 'active' : ''}`}>
            <Terminal size={20} /> <span className="nav-label">Open IDE</span>
          </button>
          <button onClick={() => setActiveTab('leaderboard')} className={`nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`}>
            <Trophy size={20} /> <span className="nav-label">Leaderboard</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}>
            <Settings size={20} /> <span className="nav-label">Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={logout}>
            <LogOut size={20} /> <span className="nav-label">Disconnect</span>
          </button>
        </div>
      </aside>

      {/* Main HUD */}
      <main className="dashboard-main">
        <header className="dash-topbar">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="dash-greeting"
            >
              Welcome back, <span className="text-gradient">{user?.name || 'Scholar'}</span> 👋
            </motion.h1>
            <p className="dash-tagline font-cursive" style={{ fontSize: '1.25rem', opacity: 0.8 }}>System nominal. Ready to level up?</p>
          </div>
          <div className="dash-user-pill glass-panel glowing-border">
            <div className="user-avatar text-gradient">
              {user?.name?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <div className="user-meta">
              <span className="user-alias">@{user?.userId || 'scholar'}</span>
              <span className="user-level">Rank {user?.level || 1}</span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="tab-content"
            >
              {/* Stats Row */}
              <div className="dash-stats-row">
                <motion.div variants={fadeUp} className="dash-stat-card glass-panel">
                  <div className="stat-icon-wrapper cyan">
                    <Zap size={24} />
                  </div>
                  <div className="stat-data">
                    <span className="stat-value">{user?.xp?.toLocaleString() || '100'}</span>
                    <span className="stat-label">Total XP</span>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="dash-stat-card glass-panel">
                  <div className="stat-icon-wrapper purple">
                    <Shield size={24} />
                  </div>
                  <div className="stat-data">
                    <span className="stat-value">{user?.level || 1}</span>
                    <span className="stat-label">Clearance Level</span>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="dash-stat-card glass-panel">
                  <div className="stat-icon-wrapper amber">
                    <Star size={24} />
                  </div>
                  <div className="stat-data">
                    <span className="stat-value">{user?.badges?.length || 1}</span>
                    <span className="stat-label">Badges Earned</span>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="dash-stat-card glass-panel">
                  <div className="stat-icon-wrapper green">
                    <Code2 size={24} />
                  </div>
                  <div className="stat-data">
                    <span className="stat-value">{user?.class || 'Unassigned'}</span>
                    <span className="stat-label">Class Specialization</span>
                  </div>
                </motion.div>
              </div>

              {/* XP Progress Bar */}
              <motion.div variants={fadeUp} className="dash-xp-card glass-panel glowing-border">
                <div className="xp-card-header">
                  <span className="xp-card-title">Progression to Level {(user?.level || 1) + 1}</span>
                  <span className="xp-card-value">{user?.xp || 100} / {nextLevelXP} XP</span>
                </div>
                <div className="xp-card-bar">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${xpPercent}%` }} 
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    className="xp-card-fill"
                  ></motion.div>
                </div>
              </motion.div>

              {/* Content Grid */}
              <motion.div variants={fadeUp} className="dash-content-grid">
                <div className="dash-content-main">
                  {(!user?.class || showClassPrompt) && (
                    <ClassSelector onSelect={() => setShowClassPrompt(false)} />
                  )}
                  <div className="dash-section">
                    <SkillTree onStartChallenge={() => setActiveTab('challenges')} />
                  </div>
                  <div className="dash-section">
                    <BadgeShowcase />
                  </div>
                </div>
                <div className="dash-content-side">
                  <Leaderboard currentUserId={user?.userId} />
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'courses' && (
            <motion.div key="courses" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="tab-content">
              <h2 className="section-title font-cursive" style={{ fontSize: '3rem' }}>Your Skill Tree</h2>
              <SkillTree onStartChallenge={() => setActiveTab('challenges')} />
            </motion.div>
          )}

          {activeTab === 'challenges' && (
            <motion.div key="challenges" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="tab-content">
              <ChallengeInterface />
            </motion.div>
          )}

          {activeTab === 'ide' && (
            <motion.div key="ide" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="tab-content">
              <IDEInterface />
            </motion.div>
          )}

          {activeTab === 'leaderboard' && (
            <motion.div key="leaderboard" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="tab-content">
              <h2 className="section-title font-cursive" style={{ fontSize: '3rem' }}>Global Rankings</h2>
              <Leaderboard currentUserId={user?.userId} />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="tab-content">
              <h2 className="section-title font-cursive" style={{ fontSize: '3rem' }}>System Settings</h2>
              <SettingsPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
