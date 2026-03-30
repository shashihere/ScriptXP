const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const crypto = require('crypto');

// Ensure temp directory exists
const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Function to safely execute shell commands with timeouts
const executeCommand = (command, timeout = 5000) => {
  return new Promise((resolve) => {
    exec(command, { timeout }, (error, stdout, stderr) => {
      resolve({ error, stdout, stderr });
    });
  });
};

router.post('/', async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: 'Code and language are required' });
  }

  // Generate a unique identifier for this execution to prevent race conditions
  const runId = crypto.randomUUID();
  let filename = '';
  let exeName = '';
  let command = '';

  try {
    switch (language) {
      case 'js':
        filename = path.join(tempDir, `${runId}.js`);
        fs.writeFileSync(filename, code);
        command = `node ${filename}`;
        break;

      case 'py':
        filename = path.join(tempDir, `${runId}.py`);
        fs.writeFileSync(filename, code);
        // Note: For windows, sometimes it's 'python', for linux 'python3'. We'll assume 'python' for Windows compatibility as default.
        command = `python ${filename}`;
        break;

      case 'cpp':
        filename = path.join(tempDir, `${runId}.cpp`);
        exeName = path.join(tempDir, `${runId}.exe`);
        fs.writeFileSync(filename, code);
        command = `g++ ${filename} -o ${exeName} && ${exeName}`;
        break;

      case 'c':
        filename = path.join(tempDir, `${runId}.c`);
        exeName = path.join(tempDir, `${runId}.exe`);
        fs.writeFileSync(filename, code);
        command = `gcc ${filename} -o ${exeName} && ${exeName}`;
        break;

      default:
        return res.status(400).json({ error: 'Unsupported language' });
    }

    // Execute the command natively
    const { error, stdout, stderr } = await executeCommand(command);

    // Provide detailed error messaging
    if (error) {
      // Differentiate between compilation syntax error vs command not found (like g++ missing)
      if (error.killed) {
        return res.json({ error: 'Execution Timed Out (Max 5 Secs)', details: stderr });
      }
      
      let customError = error.message;
      if (customError.includes('is not recognized as an internal or external command') || customError.includes('command not found')) {
        customError = `Compiler not found! Please ensure you have the compiler for '${language}' installed globally on your machine (e.g., install GCC for C/C++ or Python natively).`;
      }

      return res.json({ 
        error: customError,
        stderr: stderr
      });
    }

    // Return the clean Standard Output or Standard Error
    res.json({ output: stdout, stderr: stderr });

  } catch (err) {
    console.error('Execution Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error during file creation/execution.' });
  } finally {
    // 🗑️ Cleanup Phase - Delete temporary files asynchronously so they don't clog up the computer
    try {
      if (filename && fs.existsSync(filename)) fs.unlinkSync(filename);
      if (exeName && fs.existsSync(exeName)) fs.unlinkSync(exeName);
    } catch (cleanupError) {
      console.error('Failed to clean up temp files:', cleanupError);
    }
  }
});

module.exports = router;
