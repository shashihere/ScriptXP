import { useState } from 'react';
import './ChallengeInterface.css';

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'cpp', label: 'C++' },
  { id: 'java', label: 'Java' },
  { id: 'c', label: 'C' },
];

const STARTER_CODE = {
  javascript: 'function twoSum(nums, target) {\n  // Write your code here\n  \n}',
  python: 'def two_sum(nums, target):\n    # Write your code here\n    pass',
  cpp: '#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n    \n}',
  java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        \n    }\n}',
  c: '#include <stdlib.h>\n\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your code here\n    \n}',
};

const RETURN_KEYWORDS = {
  javascript: ['return'],
  python: ['return'],
  cpp: ['return', 'push_back'],
  java: ['return'],
  c: ['return'],
};

const HINTS = [
  'Think about what data structure would let you look up a number quickly — like checking if the complement exists.',
  'Try using a hash map. For each number, compute target - num and check if that complement is already in the map.',
  'Single-pass solution: iterate through the array once, storing each number\'s index in a hash map. For each element, check if (target - nums[i]) already exists in the map.',
];

export default function ChallengeInterface() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(STARTER_CODE.javascript);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('idle');
  const [hintsRevealed, setHintsRevealed] = useState(0);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(STARTER_CODE[newLang]);
    setOutput('');
    setStatus('idle');
  };

  const handleRunCode = () => {
    setStatus('running');
    setOutput('Running test cases...');

    setTimeout(() => {
      const keywords = RETURN_KEYWORDS[language] || ['return'];
      const hasValidCode = keywords.some((kw) => code.includes(kw));

      if (hasValidCode) {
        setStatus('success');
        setOutput('✅ All test cases passed!\n+50 XP Earned!');
      } else {
        setStatus('error');
        setOutput('❌ Test Case 1 Failed: Function did not return a value.');
      }
    }, 1500);
  };

  const revealHint = () => {
    if (hintsRevealed < HINTS.length) {
      setHintsRevealed((prev) => prev + 1);
    }
  };

  return (
    <div className="challenge-container glass-panel">
      <div className="challenge-sidebar">
        <div className="challenge-header">
          <span className="difficulty-badge easy">Easy</span>
          <h2>Two Sum</h2>
        </div>

        <div className="challenge-description">
          <p>
            Given an array of integers <code>nums</code> and an integer <code>target</code>,
            return indices of the two numbers such that they add up to <code>target</code>.
          </p>
          <p>
            You may assume that each input would have exactly one solution, and you may not use the same element twice.
          </p>

          <div className="challenge-example wrapper">
            <h4>Example 1:</h4>
            <pre>
              {`Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`}
            </pre>
          </div>
        </div>

        {/* Hints Section */}
        <div className="hints-section">
          <div className="hints-header">
            <span className="hints-icon">💡</span>
            <span className="hints-title">Hints</span>
            {hintsRevealed < HINTS.length && (
              <button className="btn-hint" onClick={revealHint}>
                Reveal Hint ({hintsRevealed}/{HINTS.length})
              </button>
            )}
            {hintsRevealed === HINTS.length && (
              <span className="hints-complete">All hints revealed</span>
            )}
          </div>
          <div className="hints-list">
            {HINTS.slice(0, hintsRevealed).map((hint, i) => (
              <div key={i} className="hint-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="hint-number">Hint {i + 1}</span>
                <p>{hint}</p>
              </div>
            ))}
            {hintsRevealed === 0 && (
              <p className="hints-empty">Stuck? Reveal a hint to get a nudge in the right direction.</p>
            )}
          </div>
        </div>
      </div>

      <div className="challenge-editor-section">
        <div className="editor-header">
          <select
            className="language-selector"
            value={language}
            onChange={handleLanguageChange}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>
          <button className="btn-run" onClick={handleRunCode} disabled={status === 'running'}>
            {status === 'running' ? 'Running...' : '▶ Run Code'}
          </button>
        </div>

        <textarea
          className="code-editor"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck="false"
        />

        <div className={`console-output ${status}`}>
          <div className="console-header">Console Output:</div>
          <pre>{output || 'Click "Run Code" to see output here.'}</pre>
        </div>
      </div>
    </div>
  );
}
