// Update with your config settings.

module.exports = {
  test: {
    client: "mssql",
    connection: {
      database: "NldPoolLeague",
      server: "nldpoolleague.database.windows.net",
      user: "nldpoolleague",
      password: process.env.DBPASSWORD,
      port: 1433,
      connectionTimeout: 30000,
      options: {
        encrypt: true
      },
    },
    migrations: {
      directory: __dirname + "/db/migrations"
    },
    seeds: {
      directory: __dirname + "/db/seeds/test"
    }
  },
  development: {
    client: "sqlite3",
    connection: {
      filename: "./db/data/nld-pool-db.sqlite"
    },
    migrations: {
      directory: __dirname + "/db/migrations"
    },
    seeds: {
      directory: __dirname + "/db/seeds/development"
    },
    pool: {
      afterCreate: function(conn, cb) {
        conn.run("PRAGMA foreign_keys = ON", cb);
      }
    }
  },
  production: {
    client: "mssql",
    connection: {
      database: "NldPoolLeague",
      server: "nldpoolleague.database.windows.net",
      user: "nldpoolleague",
      password: process.env.DBPASSWORD,
      port: 1433,
      connectionTimeout: 30000,
      options: {
        encrypt: true
      },
    },
    migrations: {
      directory: __dirname + "/db/migrations"
    },
    seeds: {
      directory: __dirname + "/db/seeds/production"
    }
  }
};
