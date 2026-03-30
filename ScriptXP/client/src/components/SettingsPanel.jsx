import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, AtSign, Lock, Save, AlertCircle, CheckCircle2, Trash2, ShieldAlert } from 'lucide-react';
import './SettingsPanel.css';

export default function SettingsPanel() {
  const { user, updateProfile, resetUserProgress, deleteUserAccount } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    userId: user?.userId || '',
    password: '',
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Danger Zone States
  const [isResetting, setIsResetting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState('');

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

  const handleResetProgress = async () => {
    if (!window.confirm("WARNING: This will permanently reset your XP, Level, and Badges to zero. This cannot be undone. Proceed?")) return;
    
    setIsResetting(true);
    const result = await resetUserProgress();
    if (result.success) {
      setStatus({ type: 'success', message: 'Neural link progress has been successfully reset.' });
    } else {
      setStatus({ type: 'error', message: result.message });
    }
    setIsResetting(false);
  };

  const handleDeleteAccount = async () => {
    if (confirmDelete !== user?.email) {
      alert("Please type your exact email to confirm account deletion.");
      return;
    }
    
    setIsDeleting(true);
    const result = await deleteUserAccount();
    if (!result.success) {
      setStatus({ type: 'error', message: result.message });
      setIsDeleting(false);
      setConfirmDelete('');
    }
    // Note: If success, the AuthContext kicks them to login automatically via logout()
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

      <div className="danger-zone glass-panel">
        <div className="danger-header">
          <ShieldAlert size={26} />
          <h3>Danger Zone</h3>
        </div>
        
        <div className="danger-item">
          <div className="danger-info">
            <h4>Reset Gamification Progress</h4>
            <p>Permanently resets your XP, Levels, and Badges back to defaults. Ideal for fresh starts.</p>
          </div>
          <button 
            className="btn-danger" 
            onClick={handleResetProgress}
            disabled={isResetting}
          >
            <AlertCircle size={18} />
            {isResetting ? "RESETTING..." : "RESET PROGRESS"}
          </button>
        </div>

        <div className="danger-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '15px' }}>
          <div className="danger-info">
            <h4>Obliterate Neural Link (Delete Account)</h4>
            <p>Permanently destroys your account data, problem submissions, and identity from the database. This action is irreversible.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', width: '100%', alignItems: 'center', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder={`Type "${user?.email}" to confirm`} 
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,60,60,0.3)',
                color: '#fff',
                padding: '10px 15px',
                borderRadius: '6px',
                flexGrow: 1,
                maxWidth: '400px'
              }}
            />
            <button 
              className="btn-danger-solid" 
              onClick={handleDeleteAccount}
              disabled={isDeleting || confirmDelete !== user?.email}
              style={{ opacity: confirmDelete === user?.email ? 1 : 0.5 }}
            >
              <Trash2 size={18} />
              {isDeleting ? "OBLITERATING..." : "DELETE ACCOUNT"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
