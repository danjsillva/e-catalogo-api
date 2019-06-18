'use strict'

const Database = use('Database')

class SetDatabaseConnection {
  async handle ({ request }, next) {
    console.dir(Database.connection())

    await next()
  }
}

module.exports = SetDatabaseConnection
