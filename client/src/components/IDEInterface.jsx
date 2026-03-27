import { useState } from 'react';
import { Play, Terminal as TerminalIcon, Cpu, AlertTriangle } from 'lucide-react';
import './IDEInterface.css';

const STARTER_CODE = {
  js: '// Welcome to the Sandbox!\nconsole.log("Hello, ScriptXP!");\n',
  py: '# Welcome to the Sandbox!\nprint("Hello, ScriptXP!")\n',
  cpp: '// Welcome to the Sandbox!\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, ScriptXP!" << endl;\n    return 0;\n}',
  java: '// Welcome to the Sandbox!\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, ScriptXP!");\n    }\n}',
  c: '// Welcome to the Sandbox!\n#include <stdio.h>\n\nint main() {\n    printf("Hello, ScriptXP!\\n");\n    return 0;\n}'
};

const CODEX_LANGUAGES = {
  js: { id: 'js', label: 'JavaScript' },
  py: { id: 'py', label: 'Python 3' },
  cpp: { id: 'cpp', label: 'C++' },
  java: { id: 'java', label: 'Java' },
  c: { id: 'c', label: 'C' }
};

const JUDGE0_LANG_IDS = {
  javascript: 63,
  python: 71,
  cpp: 54,
  java: 62,
  c: 50
};

export default function IDEInterface() {
  const [activeLangId, setActiveLangId] = useState('js');
  const [code, setCode] = useState(STARTER_CODE.js);
  const [output, setOutput] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setActiveLangId(newLang);
    setCode(STARTER_CODE[newLang]);
    setOutput('');
    setHasError(false);
  };

  const handleRunCode = async () => {
    setIsCompiling(true);
    setOutput('Initiating connection to CodeX public engine...');
    setHasError(false);

    // Browser-native Local Execution for JavaScript for instant speed
    if (activeLangId === 'js') {
      try {
        const logStorage = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logStorage.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '));
          originalLog(...args);
        };
        
        try {
          // eslint-disable-next-line no-new-func
          const runFn = new Function(code);
          runFn();
          setOutput(logStorage.join('\n') || 'Program exited with no active output.');
        } catch (err) {
          setHasError(true);
          setOutput(`===== RUNTIME ERROR =====\n${err.message}`);
        }
        
        console.log = originalLog;
      } catch (err) {
        setHasError(true);
        setOutput(`Execution failed: ${err.message}`);
      } finally {
        setIsCompiling(false);
      }
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/execute`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: code,
          language: activeLangId
        })
      });

      const data = await response.json();
      
      if (data.error) {
        setHasError(true);
        setOutput(`===== COMPILATION FAIL / RUNTIME ERROR =====\n${data.error}\n\n${data.stderr || ''}`);
        setIsCompiling(false);
        return;
      }

      setHasError(false);
      let finalOutput = data.output;
      if (!finalOutput || finalOutput.trim() === '') {
          finalOutput = 'Program exited with no active Standard Output (stdout).';
      }
      
      // If there's stderr but it didn't throw a fatal execution error (like warnings)
      if (data.stderr) finalOutput += `\n\n[Warning / Stderr Log]:\n${data.stderr}`;

      setOutput(finalOutput);

    } catch (error) {
      setHasError(true);
      setOutput('Failed to connect to local Express Engine! Ensure your backend terminal is running on port 5000.');
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="ide-container glass-panel glowing-border">
      <div className="ide-header">
        <div className="ide-brand">
          <TerminalIcon className="text-gradient" size={24} />
          <h3>NEXUS SANDBOX</h3>
        </div>
        
        <div className="ide-controls">
          <select
            className="ide-language-selector"
            value={activeLangId}
            onChange={handleLanguageChange}
          >
            {Object.entries(CODEX_LANGUAGES).map(([id, config]) => (
              <option key={id} value={id}>
                {config.label}
              </option>
            ))}
          </select>
          <button 
            className={`btn-primary ide-run-btn ${isCompiling ? 'loading' : ''}`}
            onClick={handleRunCode}
            disabled={isCompiling}
          >
            {isCompiling ? 'COMPILING...' : (
              <>
                <Play size={16} fill="currentColor" />
                <span>COMPILE & RUN</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="ide-workspace">
        <div className="ide-editor-wrapper">
          <textarea
            className="ide-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
          />
        </div>

        <div className={`ide-console ${hasError ? 'error-state' : ''}`}>
          <div className="console-title-bar">
            {hasError ? <AlertTriangle size={16} /> : <Cpu size={16} />}
            <span>STANDARD OUTPUT TERMINAL</span>
          </div>
          <pre className="console-body">
            {output || '// Awaiting compilation...'}
          </pre>
        </div>
      </div>
    </div>
  );
}
