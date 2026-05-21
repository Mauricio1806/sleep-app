module.exports = {
  apps: [
    {
      name: 'sleep-app-backend',
      script: 'server.js',
      instances: 2,
      exec_mode: 'cluster',
      max_memory_restart: '500M',
      watch: false,
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/sleep-app/error.log',
      out_file: '/var/log/sleep-app/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
