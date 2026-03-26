import { useState } from 'react';
import './Leaderboard.css';

const allTimeData = [
  { rank: 1, userId: 'quantum_dev', xp: 4850, level: 12, class: 'Algorithmist', badge: '🏆' },
  { rank: 2, userId: 'byte_ninja', xp: 4200, level: 11, class: 'Data Structurer', badge: '🥈' },
  { rank: 3, userId: 'pixel_queen', xp: 3900, level: 10, class: 'Novice', badge: '🥉' },
  { rank: 4, userId: 'data_sage', xp: 3500, level: 9, class: 'Dynamic Thinker', badge: '' },
  { rank: 5, userId: 'cloud_rider', xp: 3100, level: 8, class: 'Graph Master', badge: '' },
  { rank: 6, userId: 'code_alchemist', xp: 2800, level: 7, class: 'Algorithmist', badge: '' },
  { rank: 7, userId: 'logic_weaver', xp: 2400, level: 6, class: 'Data Structurer', badge: '' },
  { rank: 8, userId: 'style_sorcerer', xp: 2100, level: 5, class: 'Novice', badge: '' },
];

const weeklyData = [
  { rank: 1, userId: 'cloud_rider', xp: 650, level: 8, class: 'Graph Master', badge: '🏆' },
  { rank: 2, userId: 'quantum_dev', xp: 520, level: 12, class: 'Algorithmist', badge: '🥈' },
  { rank: 3, userId: 'logic_weaver', xp: 480, level: 6, class: 'Data Structurer', badge: '🥉' },
  { rank: 4, userId: 'data_sage', xp: 410, level: 9, class: 'Dynamic Thinker', badge: '' },
  { rank: 5, userId: 'pixel_queen', xp: 350, level: 10, class: 'Novice', badge: '' },
  { rank: 6, userId: 'byte_ninja', xp: 290, level: 11, class: 'Data Structurer', badge: '' },
  { rank: 7, userId: 'style_sorcerer', xp: 220, level: 5, class: 'Novice', badge: '' },
  { rank: 8, userId: 'code_alchemist', xp: 180, level: 7, class: 'Algorithmist', badge: '' },
];

export default function Leaderboard({ currentUserId }) {
  const [activeTab, setActiveTab] = useState('weekly');
  const data = activeTab === 'weekly' ? weeklyData : allTimeData;

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h3 className="leaderboard-title font-cursive" style={{ fontSize: '3rem', color: 'var(--amber)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          Wall of Fame
        </h3>
        <div className="lb-tab-toggle">
          <button
            className={`lb-tab ${activeTab === 'weekly' ? 'active' : ''}`}
            onClick={() => setActiveTab('weekly')}
          >
            This Week
          </button>
          <button
            className={`lb-tab ${activeTab === 'allTime' ? 'active' : ''}`}
            onClick={() => setActiveTab('allTime')}
          >
            All Time
          </button>
        </div>
      </div>
      <div className="leaderboard-list">
        {data.map((player) => (
          <div
            key={player.rank}
            className={`leaderboard-row ${player.userId === currentUserId ? 'current-user' : ''} ${player.rank <= 3 ? 'top-three' : ''}`}
          >
            <div className="lb-rank">
              {player.badge || `#${player.rank}`}
            </div>
            <div className="lb-user">
              <span className="lb-name">{player.userId}</span>
              <span className="lb-class">{player.class}</span>
            </div>
            <div className="lb-stats">
              <span className="lb-xp">{player.xp.toLocaleString()} XP</span>
              <span className="lb-level">Lv. {player.level}</span>
            </div>
          </div>
        ))}
      </div>
      {activeTab === 'weekly' && (
        <div className="lb-reset-note">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          Resets every Monday at 00:00 UTC
        </div>
      )}
    </div>
  );
}
