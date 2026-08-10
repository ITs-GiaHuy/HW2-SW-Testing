const fs = require('fs');
const results = JSON.parse(fs.readFileSync('e2e/results.json', 'utf-8'));
const errors = new Map();

for (const suite of results.suites || []) {
  for (const projectSuite of suite.suites || []) {
    for (const fileSuite of projectSuite.suites || []) {
      for (const spec of fileSuite.specs || []) {
        for (const test of spec.tests || []) {
          for (const result of test.results || []) {
            if (result.status === 'failed' || result.status === 'timedOut') {
              for (const err of result.errors || []) {
                let msg = err.message.split('\n')[0].substring(0, 150); // get first line
                errors.set(msg, (errors.get(msg) || 0) + 1);
              }
            }
          }
        }
      }
    }
  }
}

console.log("Top Error Messages:");
const sortedErrors = [...errors.entries()].sort((a, b) => b[1] - a[1]);
for (const [msg, count] of sortedErrors.slice(0, 10)) {
  console.log(`${count}x : ${msg}`);
}
