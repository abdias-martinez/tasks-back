import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

const bootstrap = async () => {
  const port = 3000

  const app = await NestFactory.create(AppModule)
  await app.listen(port)
}
bootstrap()
