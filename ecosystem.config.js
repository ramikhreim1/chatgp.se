module.exports = {
  apps : [{
    name: 'chatgp',
    script: 'index.js',
    instances: 3, // Number of instances you want to run
    exec_mode: 'cluster',
    watch: '.',
    env: {
      NODE_OPTIONS: '--max-old-space-size=3072',
      PORT: 3080
    },
    env_instance_1: {
      PORT: 3081
    },
    env_instance_2: {
      PORT: 3082
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
