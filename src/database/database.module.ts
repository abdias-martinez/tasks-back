import { Global, Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import config from '../config'

@Global()
@Module({
  imports: [
    // MongooseModule.forRoot()
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof config>) => ({
        uri: configService.MONGO.URI,
        dbName: configService.MONGO.dbName,
      }),
      inject: [config.KEY],
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
