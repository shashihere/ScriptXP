import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './SkillTree.css';

const skillTrees = {
  Novice: [
    { name: 'Variables & Types', unlocked: true, progress: 100, level: 1, x: 50, y: 10 },
    { name: 'Arrays', unlocked: true, progress: 60, level: 1, x: 30, y: 25 },
    { name: 'Strings', unlocked: true, progress: 30, level: 1, x: 70, y: 25 },
    { name: 'For Loops', unlocked: false, progress: 0, level: 2, x: 15, y: 45 },
    { name: 'While Loops', unlocked: false, progress: 0, level: 2, x: 50, y: 42 },
    { name: 'Functions', unlocked: false, progress: 0, level: 2, x: 85, y: 45 },
    { name: 'Time Complexity', unlocked: false, progress: 0, level: 3, x: 35, y: 62 },
    { name: 'Space Complexity', unlocked: false, progress: 0, level: 3, x: 65, y: 62 },
    { name: 'Basic Math', unlocked: false, progress: 0, level: 4, x: 50, y: 80 },
  ],
  'Data Structurer': [
    { name: 'Pointers', unlocked: true, progress: 100, level: 1, x: 50, y: 10 },
    { name: 'Singly Linked Lists', unlocked: true, progress: 50, level: 1, x: 30, y: 25 },
    { name: 'Doubly Linked Lists', unlocked: true, progress: 20, level: 1, x: 70, y: 25 },
    { name: 'Stacks', unlocked: false, progress: 0, level: 2, x: 15, y: 45 },
    { name: 'Queues', unlocked: false, progress: 0, level: 2, x: 50, y: 42 },
    { name: 'Hash Maps', unlocked: false, progress: 0, level: 2, x: 85, y: 45 },
    { name: 'Hash Sets', unlocked: false, progress: 0, level: 3, x: 35, y: 62 },
    { name: 'Binary Trees', unlocked: false, progress: 0, level: 3, x: 65, y: 62 },
    { name: 'BSTs', unlocked: false, progress: 0, level: 4, x: 50, y: 80 },
  ],
  Algorithmist: [
    { name: 'Recursion Basics', unlocked: true, progress: 100, level: 1, x: 50, y: 10 },
    { name: 'Linear Search', unlocked: true, progress: 40, level: 1, x: 25, y: 25 },
    { name: 'Binary Search', unlocked: true, progress: 40, level: 1, x: 75, y: 25 },
    { name: 'Bubble/Insertion Sort', unlocked: false, progress: 0, level: 2, x: 15, y: 45 },
    { name: 'Merge Sort', unlocked: false, progress: 0, level: 2, x: 50, y: 42 },
    { name: 'Quick Sort', unlocked: false, progress: 0, level: 2, x: 85, y: 45 },
    { name: 'Two Pointers', unlocked: false, progress: 0, level: 3, x: 35, y: 62 },
    { name: 'Sliding Window', unlocked: false, progress: 0, level: 3, x: 65, y: 62 },
    { name: 'Divide & Conquer', unlocked: false, progress: 0, level: 4, x: 50, y: 80 },
  ],
  'Dynamic Thinker': [
    { name: 'Recursion Trees', unlocked: true, progress: 100, level: 1, x: 50, y: 10 },
    { name: 'Memoization (Top-Down)', unlocked: true, progress: 50, level: 1, x: 30, y: 25 },
    { name: 'Tabulation (Bottom-Up)', unlocked: true, progress: 30, level: 1, x: 70, y: 25 },
    { name: '1D DP', unlocked: false, progress: 0, level: 2, x: 15, y: 45 },
    { name: '2D DP', unlocked: false, progress: 0, level: 2, x: 50, y: 42 },
    { name: 'Knapsack Problems', unlocked: false, progress: 0, level: 2, x: 85, y: 45 },
    { name: 'Greedy Algorithms', unlocked: false, progress: 0, level: 3, x: 35, y: 62 },
    { name: 'Backtracking', unlocked: false, progress: 0, level: 3, x: 65, y: 62 },
    { name: 'DP on Trees', unlocked: false, progress: 0, level: 4, x: 50, y: 80 },
  ],
  'Graph Master': [
    { name: 'Graph Representation', unlocked: true, progress: 100, level: 1, x: 50, y: 10 },
    { name: 'BFS', unlocked: true, progress: 60, level: 1, x: 30, y: 25 },
    { name: 'DFS', unlocked: true, progress: 25, level: 1, x: 70, y: 25 },
    { name: 'Topological Sort', unlocked: false, progress: 0, level: 2, x: 15, y: 45 },
    { name: 'Dijkstra', unlocked: false, progress: 0, level: 2, x: 50, y: 42 },
    { name: 'Bellman-Ford', unlocked: false, progress: 0, level: 2, x: 85, y: 45 },
    { name: 'Kruskal/Prim (MST)', unlocked: false, progress: 0, level: 3, x: 35, y: 62 },
    { name: 'Trie', unlocked: false, progress: 0, level: 3, x: 65, y: 62 },
    { name: 'Segment Trees', unlocked: false, progress: 0, level: 4, x: 50, y: 80 },
  ],
};

// Connections: [fromIndex, toIndex]
const connections = [
  [0, 1], [0, 2],
  [1, 3], [1, 4], [2, 4], [2, 5],
  [3, 6], [4, 6], [4, 7], [5, 7],
  [6, 8], [7, 8],
];

export default function SkillTree({ onStartChallenge }) {
  const { user } = useAuth();
  const selectedClass = user?.class;
  const skills = skillTrees[selectedClass] || [];
  const [selectedSkill, setSelectedSkill] = useState(null);

  if (!selectedClass) {
    return (
      <div className="skill-tree-empty">
        <div className="skill-tree-empty-icon">🌳</div>
        <h3 className="font-cursive">Your Skill Tree Awaits</h3>
        <p>Choose a class above to unlock your personalized learning path</p>
      </div>
    );
  }

  return (
    <div className="skill-tree">
      <div className="skill-tree-header">
        <h3 className="skill-tree-title">
          <span className="skill-tree-class">{selectedClass}</span> Skill Tree
        </h3>
        <div className="skill-tree-legend">
          <span className="legend-item"><span className="legend-dot unlocked"></span> Unlocked</span>
          <span className="legend-item"><span className="legend-dot locked"></span> Locked</span>
        </div>
      </div>
      <div className="skill-tree-container">
        <svg className="skill-tree-lines" viewBox="0 0 100 90" preserveAspectRatio="xMidYMid meet">
          {connections.map(([from, to], i) => (
            <line
              key={i}
              x1={skills[from]?.x}
              y1={skills[from]?.y}
              x2={skills[to]?.x}
              y2={skills[to]?.y}
              stroke={skills[from]?.unlocked && skills[to]?.unlocked ? 'var(--cyan)' : 'rgba(100, 116, 139, 0.25)'}
              strokeWidth="0.4"
              strokeDasharray={skills[from]?.unlocked && skills[to]?.unlocked ? 'none' : '2,2'}
            />
          ))}
        </svg>
        <div className="skill-nodes">
          {skills.map((skill, i) => (
            <div
              key={i}
              className={`skill-node ${skill.unlocked ? 'unlocked' : 'locked'}`}
              style={{ left: `${skill.x}%`, top: `${skill.y}%` }}
              onClick={() => setSelectedSkill(skill)}
              role="button"
              tabIndex={0}
            >
              <div className="skill-node-circle">
                {skill.unlocked && skill.progress > 0 && (
                  <svg className="skill-progress-ring" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(100,116,139,0.2)" strokeWidth="2" />
                    <circle
                      cx="18" cy="18" r="15.5"
                      fill="none"
                      stroke="var(--cyan)"
                      strokeWidth="2"
                      strokeDasharray={`${skill.progress} ${100 - skill.progress}`}
                      strokeDashoffset="25"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                {skill.unlocked ? (
                  <span className="node-check">✓</span>
                ) : (
                  <span className="node-lock">🔒</span>
                )}
              </div>
              <span className="skill-node-label">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedSkill && (
        <div className="skill-modal-overlay" onClick={() => setSelectedSkill(null)}>
          <div className="skill-modal glass-panel" onClick={e => e.stopPropagation()}>
            <button className="skill-modal-close" onClick={() => setSelectedSkill(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className={`skill-modal-icon ${selectedSkill.unlocked ? 'unlocked' : 'locked'}`}>
              {selectedSkill.unlocked ? '✓' : '🔒'}
            </div>
            <h3 className="skill-modal-title">{selectedSkill.name}</h3>
            <div className="skill-modal-meta">
              <span className="skill-modal-level">Level {selectedSkill.level}</span>
              <span className="skill-modal-status">
                {selectedSkill.unlocked ? 'Unlocked' : 'Locked'}
              </span>
            </div>

            <p className="skill-modal-desc">
              {selectedSkill.unlocked
                ? `Master the concepts of ${selectedSkill.name} to earn XP and progress further in the ${selectedClass} path.`
                : `Complete previous nodes in the skill tree to unlock ${selectedSkill.name}.`}
            </p>

            {selectedSkill.unlocked && (
              <div className="skill-modal-progress">
                <div className="progress-label">
                  <span>Current Progress</span>
                  <span>{selectedSkill.progress}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${selectedSkill.progress}%` }}></div>
                </div>
              </div>
            )}

            <div className="skill-modal-actions">
              <button
                className="btn-primary"
                disabled={!selectedSkill.unlocked}
                onClick={() => {
                  if (onStartChallenge) {
                    onStartChallenge(selectedSkill.name);
                  }
                  setSelectedSkill(null);
                }}
              >
                {selectedSkill.progress === 100 ? 'Review Challenges' : 'Start Challenges'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
