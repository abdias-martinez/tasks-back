import { registerAs } from '@nestjs/config'

export default registerAs('config', () => ({
  MONGO: {
    URI: process.env.MONGO_URI,
    dbName: process.env.MONGO_DB,
  },
}))
