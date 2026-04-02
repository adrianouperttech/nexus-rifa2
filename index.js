// index.js

const { execSync } = require('child_process');

try {
  // A lógica do Prisma foi removida.
  
  // Start the main application
  console.log('Starting application from dist/server.js...');
  require('./dist/server.js');
  
} catch (error) {
  console.error('Error during startup:', error);
  process.exit(1);
}
