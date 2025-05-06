const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

async function build() {
  try {
    // Build client
    console.log('Building client...');
    execSync('npm run build', { 
      cwd: path.join(__dirname, 'client'),
      stdio: 'inherit'
    });

    // Create server/public directory if it doesn't exist
    const publicDir = path.join(__dirname, 'server', 'public');
    await fs.ensureDir(publicDir);

    // Copy client build to server/public
    console.log('Copying build files to server/public...');
    await fs.copy(
      path.join(__dirname, 'client', 'dist'),
      publicDir
    );

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
