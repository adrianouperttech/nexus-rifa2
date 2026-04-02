
// index.js

const { execSync } = require('child_process');

try {
  // Ensure Prisma client is generated
  console.log('Executing prisma generate...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma client generated.');

  // Start the main application
  console.log('Starting application from dist/server.js...');
  require('./dist/server.js');
  
} catch (error) {
  console.error('Error during startup:', error);
  process.exit(1);
}
