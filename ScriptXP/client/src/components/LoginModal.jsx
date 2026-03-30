import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { X, Mail, Lock, LogIn, KeyRound } from 'lucide-react';
import './LoginModal.css';

export default function LoginModal({ isOpen, onClose, onSwitchToSignUp }) {
  const { login, googleLogin, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('System requires all fields');
      return;
    }

    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    const result = await googleLogin(credentialResponse.credential);
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
                <div className="modal-icon-wrapper">
                  <KeyRound size={28} className="text-gradient" />
                </div>
                <h2 className="modal-title">ACCESS PORTAL</h2>
                <p className="modal-subtitle">Authenticate to continue</p>
              </div>

              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="login-email">Neural Link ID (Email)</label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      id="login-email"
                      type="email"
                      placeholder="scholar@scriptxp.dev"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="login-password">Passkey</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      autoComplete="current-password"
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
                >
                  {loading ? 'AUTHENTICATING...' : (
                    <>
                      <span>INITIALIZE LOGIN</span>
                      <LogIn size={18} />
                    </>
                  )}
                </button>

                <div className="google-auth-wrapper" style={{ marginTop: '15px', display: 'flex', justifyContent: 'center' }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Google Sign In was unsuccessful.')}
                    theme="filled_black"
                    shape="pill"
                    text="continue_with"
                  />
                </div>
              </form>

              <div className="modal-footer">
                <p>New to the Nexus?{' '}
                  <button className="link-button" onClick={onSwitchToSignUp}>Construct Profile</button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
