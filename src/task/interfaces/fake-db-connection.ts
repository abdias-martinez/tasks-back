import { MongoMemoryServer } from 'mongodb-memory-server'
import { Connection } from 'mongoose'

export interface IFakeDbConnection {
  mongod: MongoMemoryServer
  mongoConnection: Connection
  mongoUri: string
}
