module.exports = {
  servers: {
    one: {
      host: '52.26.4.238',
      username: 'ubuntu',
      pem: "./urbanemojinarycom.pem"
      // pem:
      // password:
      // or leave blank for authenticate from ssh-agent
    }
  },

  meteor: {
    name: 'urbanemojinary',
    path: '.',
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: 'http://urbanemojinary.com',
      MONGO_URL: 'mongodb://localhost/meteor'
    },
    dockerImage: 'abernix/meteord:base',

    buildOptions: {
      serverOnly: true,
      debug: true,
      cleanAfterBuild: true // default
    },

    //dockerImage: 'kadirahq/meteord'
    deployCheckWaitTime: 60
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};