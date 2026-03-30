import { useState, useEffect } from 'react';
import './XPNotification.css';

export default function XPNotification({ amount = 100, message = 'Welcome Bonus!', show = false }) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setAnimating(true);
      const timer = setTimeout(() => {
        setAnimating(false);
        setTimeout(() => setVisible(false), 500);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div className={`xp-notification ${animating ? 'active' : 'fading'}`}>
      <div className="xp-notification-inner">
        <div className="xp-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
        <div className="xp-text">
          <span className="xp-amount">+{amount} XP</span>
          <span className="xp-message">{message}</span>
        </div>
        <div className="xp-particles">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="xp-particle" style={{ '--delay': `${i * 0.15}s`, '--angle': `${i * 60}deg` }}></span>
          ))}
        </div>
      </div>
    </div>
  );
}
