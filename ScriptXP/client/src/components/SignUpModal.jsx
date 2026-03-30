import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, AtSign, UserPlus } from 'lucide-react';
import './SignUpModal.css';

export default function SignUpModal({ isOpen, onClose, onSwitchToLogin }) {
  const { signup, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userId: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.userId || !formData.password) {
      setError('System requires all fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Passkey must be at least 6 characters');
      return;
    }

    const result = await signup(formData);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-backdrop">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="modal-container glass-panel glowing-border"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={onClose} aria-label="Close">
                <X size={20} />
              </button>

              <div className="modal-header">
                <div className="modal-icon-wrapper" style={{ background: 'rgba(123, 97, 255, 0.1)', borderColor: 'rgba(123, 97, 255, 0.2)', boxShadow: '0 0 20px rgba(123, 97, 255, 0.2)' }}>
                  <UserPlus size={28} className="text-gradient-purple" />
                </div>
                <h2 className="modal-title">NEW INSTANCE</h2>
                <p className="modal-subtitle">Initialize your scholar profile</p>
              </div>

              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="signup-name">Display Designation</label>
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input
                      id="signup-name"
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="signup-email">Neural Link ID</label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      id="signup-email"
                      type="email"
                      name="email"
                      placeholder="scholar@scriptxp.dev"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="signup-userid">Global Alias</label>
                  <div className="input-wrapper">
                    <AtSign size={18} className="input-icon" />
                    <input
                      id="signup-userid"
                      type="text"
                      name="userId"
                      placeholder="code_wizard_42"
                      value={formData.userId}
                      onChange={handleChange}
                    />
                  </div>
                  <span className="input-hint">Unique identifier for leaderboards</span>
                </div>

                <div className="input-group">
                  <label htmlFor="signup-password">Construct Passkey</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      id="signup-password"
                      type="password"
                      name="password"
                      placeholder="Min. 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="form-error">
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  className={`btn-primary submit-btn ${loading ? 'loading' : ''}`}
                  disabled={loading}
                  style={{ background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-tertiary))', boxShadow: '0 0 15px rgba(123, 97, 255, 0.3)' }}
                >
                  {loading ? 'FORGING...' : (
                    <>
                      <span>CREATE PROFILE</span>
                      <UserPlus size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="modal-footer">
                <p>Profile exists?{' '}
                  <button className="link-button" onClick={onSwitchToLogin} style={{ color: 'var(--accent-secondary)' }}>Access Terminal</button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
