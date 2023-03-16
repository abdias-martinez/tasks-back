import { MongoMemoryServer } from 'mongodb-memory-server'
import * as Fixtures from 'node-mongodb-fixtures'
import * as mongoose from 'mongoose'
import { Logger } from '@nestjs/common'

export class MongoHelper {
  static createServer = async () => await MongoMemoryServer.create()

  static setup = async (
    fixturesPath: string,
    mongoServer: MongoMemoryServer,
  ) => {
    const mongoUri = mongoServer.getUri()
    const fixtures = new Fixtures({
      dir: fixturesPath,
      filter: '.*',
      mute: true,
    })

    await fixtures
      .connect(mongoUri)
      .then(() => fixtures.unload())
      .then(() => fixtures.load())
      .catch(() => new Logger())
      .finally(() => fixtures.disconnect())

    await mongoose.connect(mongoUri)
    return mongoUri
  }

  static stop = async (mongoServer: MongoMemoryServer): Promise<boolean> => {
    await mongoose.disconnect()
    return mongoServer.stop()
  }
}
