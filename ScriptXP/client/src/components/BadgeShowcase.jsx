import { useAuth } from '../context/AuthContext';
import './BadgeShowcase.css';

const ALL_BADGES = [
  { id: 'early_adopter', name: 'Early Adopter', icon: '🌱', description: 'Sign up for Script XP', color: '#10b981' },
  { id: 'first_blood', name: 'First Blood', icon: '⚔️', description: 'Solve your first problem', color: '#ef4444' },
  { id: 'speed_demon', name: 'Speed Demon', icon: '⚡', description: 'Solve a problem in under 2 minutes', color: '#f59e0b' },
  { id: 'streak_master', name: 'Streak Master', icon: '🔥', description: 'Maintain a 7-day streak', color: '#f97316' },
  { id: 'centurion', name: 'Centurion', icon: '💯', description: 'Reach 1,000 XP', color: '#8b5cf6' },
  { id: 'algorithm_ace', name: 'Algorithm Ace', icon: '🎯', description: 'Complete all Algorithmist skills', color: '#06b6d4' },
  { id: 'data_wizard', name: 'Data Wizard', icon: '🧙', description: 'Complete all Data Structurer skills', color: '#a855f7' },
  { id: 'graph_explorer', name: 'Graph Explorer', icon: '🗺️', description: 'Complete all Graph Master skills', color: '#14b8a6' },
  { id: 'dynamic_mind', name: 'Dynamic Mind', icon: '🧠', description: 'Complete all Dynamic Thinker skills', color: '#ec4899' },
  { id: 'hint_hunter', name: 'Hint Hunter', icon: '💡', description: 'Use 10 hints across problems', color: '#eab308' },
  { id: 'perfectionist', name: 'Perfectionist', icon: '✨', description: 'Solve 5 problems without hints', color: '#6366f1' },
  { id: 'night_owl', name: 'Night Owl', icon: '🦉', description: 'Solve a problem after midnight', color: '#475569' },
];

export default function BadgeShowcase() {
  const { user } = useAuth();
  const earnedBadges = user?.badges || ['Early Adopter'];

  const isEarned = (badge) => {
    return earnedBadges.some(
      (b) => b.toLowerCase() === badge.name.toLowerCase() || b.toLowerCase() === badge.id.toLowerCase()
    );
  };

  const earnedCount = ALL_BADGES.filter(isEarned).length;

  return (
    <div className="badge-showcase">
      <div className="badge-showcase-header">
        <h3 className="badge-showcase-title font-cursive" style={{ fontSize: '3rem', color: 'var(--accent-secondary)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="12" cy="8" r="7"></circle>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
          </svg>
          Achievement Badges
        </h3>
        <span className="badge-showcase-count">{earnedCount} / {ALL_BADGES.length} Earned</span>
      </div>
      <div className="badge-grid">
        {ALL_BADGES.map((badge) => {
          const earned = isEarned(badge);
          return (
            <div
              key={badge.id}
              className={`badge-card ${earned ? 'earned' : 'locked'}`}
              style={earned ? { '--badge-color': badge.color } : {}}
            >
              <div className="badge-card-icon">
                <span>{badge.icon}</span>
                {!earned && <span className="badge-lock-overlay">🔒</span>}
              </div>
              <span className="badge-card-name">{badge.name}</span>
              <span className="badge-card-desc">{badge.description}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
