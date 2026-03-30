import { useAuth } from '../context/AuthContext';
import './ClassSelector.css';

const classes = [
  {
    name: 'Novice',
    icon: '🌱',
    desc: 'Master the basics of programming: variables, arrays, and loops.',
    color: 'var(--cyan)',
    glow: 'var(--cyan-glow)',
    skills: ['Arrays', 'Strings', 'Loops', 'Functions', 'Time Comp'],
  },
  {
    name: 'Data Structurer',
    icon: '🏗️',
    desc: 'Build a strong foundation in organizing data efficiently.',
    color: 'var(--green)',
    glow: 'var(--green-glow)',
    skills: ['Linked Lists', 'Stacks', 'Queues', 'Hash Tables', 'Trees'],
  },
  {
    name: 'Algorithmist',
    icon: '⚡',
    desc: 'Learn to solve complex problems with elegant algorithms.',
    color: 'var(--purple)',
    glow: 'var(--purple-glow)',
    skills: ['Sorting', 'Searching', 'Recursion', 'Two Pointers', 'Sliding Window'],
  },
  {
    name: 'Dynamic Thinker',
    icon: '🧠',
    desc: 'Master the art of breaking problems into smaller subproblems.',
    color: 'var(--amber)',
    glow: 'var(--amber-glow)',
    skills: ['Memoization', 'Tabulation', 'Greedy Algos', 'Backtracking'],
  },
  {
    name: 'Graph Master',
    icon: '🕸️',
    desc: 'Navigate complex networks and advanced data relationships.',
    color: 'var(--rose)',
    glow: 'var(--rose-glow)',
    skills: ['BFS/DFS', 'Shortest Path', 'MST', 'Trie', 'Adv Trees'],
  },
];

export default function ClassSelector({ onSelect }) {
  const { user, selectClass } = useAuth();

  const handleSelect = (cls) => {
    selectClass(cls.name);
    if (onSelect) onSelect(cls.name);
  };

  return (
    <div className="class-selector">
      <div className="class-selector-header">
        <h3 className="class-selector-title">Choose Your Class</h3>
        <p className="class-selector-subtitle font-cursive">Your destiny awaits, craft your Skill Tree~</p>
      </div>
      <div className="class-grid">
        {classes.map((cls) => (
          <button
            key={cls.name}
            className={`class-card ${user?.class === cls.name ? 'selected' : ''}`}
            style={{ '--card-color': cls.color, '--card-glow': cls.glow }}
            onClick={() => handleSelect(cls)}
          >
            <div className="card-content-wrapper">
              <div className="class-card-icon">{cls.icon}</div>
              <h4 className="class-card-name">{cls.name}</h4>
              <p className="class-card-desc">{cls.desc}</p>
              <div className="class-card-skills">
                {cls.skills.map((skill) => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
            {user?.class === cls.name && (
              <div className="selected-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Active
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
