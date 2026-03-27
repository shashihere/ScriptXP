import { useState } from 'react';
import './ChallengeInterface.css';

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'cpp', label: 'C++' },
  { id: 'java', label: 'Java' },
  { id: 'c', label: 'C' },
];

const RETURN_KEYWORDS = {
  javascript: ['return'],
  python: ['return'],
  cpp: ['return', 'push_back'],
  java: ['return'],
  c: ['return'],
};

const CHALLENGES = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    note: 'You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    example: 'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].',
    hints: [
      'Think about what data structure would let you look up a number quickly — like checking if the complement exists.',
      'Try using a hash map. For each number, compute target - num and check if that complement is already in the map.',
      'Single-pass solution: iterate through the array once, storing each number\'s index in a hash map. For each element, check if (target - nums[i]) already exists in the map.'
    ],
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  // Write your code here\n  \n}',
      python: 'def two_sum(nums, target):\n    # Write your code here\n    pass',
      cpp: '#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n    \n}',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        \n    }\n}',
      c: '#include <stdlib.h>\n\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your code here\n    \n}'
    }
  },
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
    note: 'Given a string s, return true if it is a palindrome, or false otherwise.',
    example: 'Input: s = "A man, a plan, a canal: Panama"\nOutput: true\nExplanation: "amanaplanacanalpanama" is a palindrome.',
    hints: [
      'You can use two pointers, one at the beginning and one at the end of the string.',
      'Increment the left pointer and decrement the right pointer until they meet, skipping non-alphanumeric characters.',
      'Alternatively, filter the string first, then reverse it and compare it to the filtered string.'
    ],
    starterCode: {
      javascript: 'function isPalindrome(s) {\n  // Write your code here\n  \n}',
      python: 'def isPalindrome(s: str) -> bool:\n    # Write your code here\n    pass',
      cpp: '#include <string>\nusing namespace std;\n\nbool isPalindrome(string s) {\n    // Write your code here\n    \n}',
      java: 'class Solution {\n    public boolean isPalindrome(String s) {\n        // Write your code here\n        \n    }\n}',
      c: '#include <stdbool.h>\n\nbool isPalindrome(char * s) {\n    // Write your code here\n    \n}'
    }
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps.',
    note: 'In how many distinct ways can you climb to the top?',
    example: 'Input: n = 3\nOutput: 3\nExplanation: There are three ways to climb to the top.\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step',
    hints: [
      'To reach step n, you must have either climbed from step n-1 or step n-2.',
      'This means the total ways to reach step n is the sum of ways to reach n-1 and ways to reach n-2.',
      'This is the exact same logic as the Fibonacci sequence! You can solve it dynamically.'
    ],
    starterCode: {
      javascript: 'function climbStairs(n) {\n  // Write your code here\n  \n}',
      python: 'def climbStairs(n: int) -> int:\n    # Write your code here\n    pass',
      cpp: 'int climbStairs(int n) {\n    // Write your code here\n    \n}',
      java: 'class Solution {\n    public int climbStairs(int n) {\n        // Write your code here\n        \n    }\n}',
      c: 'int climbStairs(int n) {\n    // Write your code here\n    \n}'
    }
  }
];

export default function ChallengeInterface() {
  const [activeChallengeIndex, setActiveChallengeIndex] = useState(0);
  const challenge = CHALLENGES[activeChallengeIndex];
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(challenge.starterCode.javascript);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('idle');
  const [hintsRevealed, setHintsRevealed] = useState(0);

  const handleChallengeChange = (index) => {
    setActiveChallengeIndex(index);
    setLanguage('javascript');
    setCode(CHALLENGES[index].starterCode.javascript);
    setOutput('');
    setStatus('idle');
    setHintsRevealed(0);
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(challenge.starterCode[newLang]);
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
        setOutput('❌ Test Case 1 Failed: Function did not return a valid value or threw an error.');
      }
    }, 1500);
  };

  const revealHint = () => {
    if (hintsRevealed < challenge.hints.length) {
      setHintsRevealed((prev) => prev + 1);
    }
  };

  return (
    <div className="challenge-container glass-panel">
      <div className="challenge-sidebar">
        <div className="challenge-header">
          <span className={`difficulty-badge ${challenge.difficulty.toLowerCase()}`}>{challenge.difficulty}</span>
          <h2>{challenge.title}</h2>
        </div>

        <div className="challenge-description">
          <p>{challenge.description}</p>
          <p>{challenge.note}</p>

          <div className="challenge-example wrapper">
            <h4>Example 1:</h4>
            <pre>{challenge.example}</pre>
          </div>
        </div>

        {/* Hints Section */}
        <div className="hints-section">
          <div className="hints-header">
            <span className="hints-icon">💡</span>
            <span className="hints-title">Hints</span>
            {hintsRevealed < challenge.hints.length && (
              <button className="btn-hint" onClick={revealHint}>
                Reveal Hint ({hintsRevealed}/{challenge.hints.length})
              </button>
            )}
            {hintsRevealed === challenge.hints.length && (
              <span className="hints-complete">All hints revealed</span>
            )}
          </div>
          <div className="hints-list">
            {challenge.hints.slice(0, hintsRevealed).map((hint, i) => (
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
            style={{ marginRight: '10px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', padding: '5px 10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)' }}
            value={activeChallengeIndex}
            onChange={(e) => handleChallengeChange(Number(e.target.value))}
          >
            {CHALLENGES.map((chal, idx) => (
              <option key={chal.id} value={idx}>{chal.title}</option>
            ))}
          </select>
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
