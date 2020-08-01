module.exports = {
  apps : [{
    script: 'index.js',
    name: 'campathon-backend',
    env: {
      NODE_ENV: "production"
    },
    exec_mode: "fork_mode",
    log_date_format: "YYYY-MM-DD HH:mm Z"
  }]
};
