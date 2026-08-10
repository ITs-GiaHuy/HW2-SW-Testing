const fs = require('fs');
const log = fs.readFileSync('.git/logs/HEAD', 'utf8');
const lines = log.trim().split('\n');
let out = 'GIT COMMIT LOG\n' + '='.repeat(100) + '\n\n';
out += 'HASH    | DATE                | AUTHOR                              | MESSAGE\n';
out += '-'.repeat(100) + '\n';

lines.reverse().forEach(line => {
    if (line.includes('\tcommit')) {
        const parts = line.split('\t');
        const meta = parts[0].split(' ');
        
        let msg = parts[1];
        msg = msg.replace(/^commit.*?:\s*/, '');
        
        const hash = meta[1].substring(0, 7);
        const author = meta.slice(2, meta.length - 2).join(' ');
        const ts = parseInt(meta[meta.length - 2]);
        
        // Convert to ISO-like local time manually, or just use ISO string 
        const date = new Date(ts * 1000 + 7 * 3600 * 1000).toISOString().replace('T', ' ').substring(0, 19) + ' +0700';
        
        out += `${hash} | ${date} | ${author.padEnd(35)} | ${msg}\n`;
    }
});

fs.writeFileSync('23127378_HW04_AI_Automation_100/git-commit-log.txt', out);
console.log('Git log written to 23127378_HW04_AI_Automation_100/git-commit-log.txt');
