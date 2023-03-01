import { registerAs } from '@nestjs/config'

console.log('hola')

export default registerAs('config', () => ({
  MONGO: {
    URI: process.env.MONGO_URI,
    dbName: process.env.MONGO_DB,
  },
}))
