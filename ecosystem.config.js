// PM2 Ecosystem Configuration File
// This file can be used with: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'sos-backend',
      script: './backend/dist/index.js',
      cwd: './backend',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    },
    {
      name: 'sos-frontend',
      script: 'npm',
      args: 'run serve',
      cwd: './frontend',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
    },
  ],
};

