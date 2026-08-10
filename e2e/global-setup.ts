import { execFileSync } from 'child_process';
import path from 'path';

async function globalSetup() {
  console.log('🔄 Global Setup: Resetting Backend Database...');
  try {
    // Sử dụng process.execPath để gọi đúng phiên bản Node đang chạy Playwright
    const dbScriptPath = path.join(__dirname, '../backend/database.js');
    execFileSync(process.execPath, [dbScriptPath], { stdio: 'inherit' });
    console.log('✅ Database reset successfully.');
  } catch (error) {
    console.error('❌ Failed to reset database:', error);
  }
}

export default globalSetup;
