async function test() {
  const code = '#include <iostream>\nusing namespace std;\nint main() { cout << "Hello" << endl; return 0; }';
  const response = await fetch('https://api.codex.jaagrav.in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: code, language: 'cpp', input: '' })
  });
  const data = await response.json();
  console.log(data);
}
test();
