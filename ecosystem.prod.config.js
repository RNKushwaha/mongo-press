module.exports = {
  apps : [{
    name: "mongo-press",
    script: 'dist/index.js',
    exec_mode : "cluster",//or fork
    instances : "max",// max or 2, 4 etc.
    env_production: {
      NODE_ENV: "production",
      PORT: 81 // override PORT defined in env to this value when env is production
    }
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
