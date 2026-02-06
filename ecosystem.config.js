module.exports = {
  apps: [
    {
      name: 'mcp-server',
      cwd: '/var/www/pasabayan-ai-chat/mcp-server',
      script: 'dist/server-http.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
    },
    {
      name: 'chat-backend',
      cwd: '/var/www/pasabayan-ai-chat/chat-backend',
      script: 'dist/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
    {
      name: 'chat-frontend',
      cwd: '/var/www/pasabayan-ai-chat/chat-frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3003',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3003,
      },
    },
  ],
};
