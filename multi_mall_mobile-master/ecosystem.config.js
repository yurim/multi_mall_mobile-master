module.exports = {
  apps: [{
    name: 'front',
    script: 'yarn',
    args: 'start',
    instances: 2,
    exec_mode: 'cluster',
    autorestart: true,
    env: {
      NODE_ENV: 'test', // 개발환경시 적용될 설정 지정
    },
    // autorestart: true,
    // env: {
    //   NODE_ENV: "development",
    // },
    // 배포 환경에서 적용될 설정
    // pm2 start ecosystem.config.js --env production
    // env_production: {
    //   NODE_ENV: "production",
    // },
    // output: './logs/console.log',
    // error: './logs/consoleError.log',
  // }, {
  //   script: './service-worker/',
  //   watch: ['./service-worker']
  }],

  // deploy : {
  //   production : {
  //     user : 'SSH_USERNAME',
  //     host : 'SSH_HOSTMACHINE',
  //     ref  : 'origin/master',
  //     repo : 'GIT_REPOSITORY',
  //     path : 'DESTINATION_PATH',
  //     'pre-deploy-local': '',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
  //     'pre-setup': ''
  //   }
  // }
};
