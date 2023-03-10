import { MongoMemoryServer } from 'mongodb-memory-server'
import * as Fixtures from 'node-mongodb-fixtures'
import { Connection, connect } from 'mongoose'
import { IFakeDbConnection } from '../src/task/interfaces/fake-db-connection'

export class MongoHelper {
  static startFakeDbConnection = async (): Promise<IFakeDbConnection> => {
    const fixtures = new Fixtures({
      dir: 'src/task/fixtures/',
      filter: '.*',
      mute: true,
    })

    const mongod: MongoMemoryServer = await MongoMemoryServer.create()
    const mongoUri = mongod.getUri()
    await fixtures.connect(mongoUri, {
      useUnifiedTopology: true,
    })
    await fixtures.load()
    await fixtures.unload()
    await fixtures.disconnect()

    const mongoConnection: Connection = (await connect(mongoUri)).connection

    return {
      mongod,
      mongoConnection,
      mongoUri,
    }
  }

  static stopFakeDbConnection = async (
    fakeDbConnection: IFakeDbConnection,
  ): Promise<void> => {
    await fakeDbConnection?.mongoConnection.dropDatabase()
    await fakeDbConnection?.mongoConnection.close()
    await fakeDbConnection?.mongod.stop()
  }
}
