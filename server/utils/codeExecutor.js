exports.evaluateCode = async (code, language, testCases) => {
  // Mocking Judge0 API for Hackathon scope
  let allPassed = true;
  let time = 0;
  let memory = 0;
  
  if (!code || code.trim() === '') {
    return { status: 'Compilation Error', results: [] };
  }

  const results = testCases.map((tc, index) => {
    // Fake the result based on code presence
    const passed = code.includes('return') || code.includes('System.out') || code.length > 5;
    if (!passed) allPassed = false;
    time += Math.random() * 50;
    memory += Math.random() * 5000;
    
    return {
      testCaseIndex: index,
      passed,
      expected: tc.expectedOutput,
      output: passed ? tc.expectedOutput : 'Wrong output',
      isHidden: tc.isHidden
    };
  });

  return {
    status: allPassed ? 'Accepted' : 'Wrong Answer',
    time: testCases.length ? time / testCases.length : 0,
    memory: testCases.length ? memory / testCases.length : 0,
    results
  };
};
