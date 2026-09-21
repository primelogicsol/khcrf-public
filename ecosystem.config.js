module.exports = {
  apps: [
    {
      name: 'khcrf-backend',
      cwd: './backend',
      script: 'dist/index.js',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        EXPECTED_DATABASE: 'hcrf_db_clean',
        CLUSTER_DISABLED: 'true'
      }
    },
    {
      name: 'khcrf-frontend',
      cwd: './frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
