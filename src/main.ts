import { BadRequestException, HttpStatus, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api/')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          errors: errors.map((error) => ({
            property: error.property,
            value: error.value,
            constraints: error.constraints,
          })),
        })
      },
    }),
  )
  await app.listen(process.env.PORT)
}

bootstrap()
