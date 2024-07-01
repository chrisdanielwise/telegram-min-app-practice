module.exports = {
 
    apps: [
      {
        name: 'backend1',
        script: 
        process.env.NODE_ENV === 'development' ? 'npm run dev' : 'npm start',
        args: 'src/index.js',
        watch: process.env.NODE_ENV === 'development',
        node_version: '16.13.0',
        bun_version: '1.2.3',
        exec_mode: 'fork',
        // port: 8000, // Add this line
        env: {
          NODE_ENV: process.env.NODE_ENV || 'development',
          DEBUG: process.env.NODE_ENV === 'development' ? '*' : undefined
        }
      }
    ]
};
// pm2 start ecosystem.config.js --env development
// pm2 start ecosystem.config.js --env production