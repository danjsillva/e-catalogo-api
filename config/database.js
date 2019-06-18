"use strict";

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use("Env");

/** @type {import('@adonisjs/ignitor/src/Helpers')} */
const Helpers = use("Helpers");

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Default Connection
  |--------------------------------------------------------------------------
  |
  | Connection defines the default connection settings to be used while
  | interacting with SQL databases.
  |
  */
  connection: "teste",

  teste1: {
    client: "pg",
    connection: {
      host: "motty.db.elephantsql.com",
      port: 5432,
      user: "xssunfxj",
      password: "Usn0-3elDjm1fXPjJAeoOt5nnO6uRfHt",
      database: "xssunfxj"
    },
    debug: Env.get("DB_DEBUG", false)
  },

  teste2: {
    client: "pg",
    connection: {
      host: "motty.db.elephantsql.com",
      port: 5432,
      user: "isriplxr",
      password: "ZCUWYtKEG_l_EX41dSo5fu1wixLLHGnE",
      database: "isriplxr"
    },
    debug: Env.get("DB_DEBUG", false)
  }
};
