module.exports = {
    apps: [
      {
        name: 'NuxtAppName',
        port: '3006',
        exec_mode: 'fork',
        instances: '1',
        script: './.output/server/index.mjs'
      }
    ]
  }