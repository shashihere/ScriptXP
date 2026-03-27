import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, AtSign, Lock, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import './SettingsPanel.css';

export default function SettingsPanel() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    userId: user?.userId || '',
    password: '',
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    const updateData = {
      name: formData.name,
      email: formData.email,
      userId: formData.userId,
    };
    
    if (formData.password) {
      if (formData.password.length < 6) {
        setStatus({ type: 'error', message: 'Passkey must be at least 6 characters long.' });
        setIsSubmitting(false);
        return;
      }
      updateData.password = formData.password;
    }

    const result = await updateProfile(updateData);
    
    if (result.success) {
      setStatus({ type: 'success', message: 'System parameters updated successfully!' });
      setFormData(prev => ({ ...prev, password: '' }));
    } else {
      setStatus({ type: 'error', message: result.message });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h3 className="font-cursive" style={{ fontSize: '2rem', color: 'var(--accent-primary)', marginBottom: '10px' }}>Account Configuration</h3>
        <p>Update your neural link parameters and display identifiers.</p>
      </div>

      <div className="settings-content glass-panel glowing-border">
        {status.message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className={`settings-alert ${status.type}`}
          >
            {status.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span>{status.message}</span>
          </motion.div>
        )}

        <form className="settings-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="settings-name">Display Designation</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  id="settings-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="settings-email">Neural Link ID (Email)</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  id="settings-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="settings-userid">Global Alias (ID)</label>
              <div className="input-wrapper">
                <AtSign size={18} className="input-icon" />
                <input
                  id="settings-userid"
                  type="text"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="settings-password">New Passkey (Optional)</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="settings-password"
                  type="password"
                  name="password"
                  placeholder="Enter to change password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="settings-actions">
            <button 
              type="submit" 
              className={`btn-primary ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'UPLOADING...' : (
                <>
                  <Save size={18} />
                  <span>SAVE CONFIGURATION</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
