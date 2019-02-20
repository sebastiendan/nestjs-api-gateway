import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as dotenv from 'dotenv'

import { AppModule } from './app.module'
import { RedisIoAdapter } from './redis-io.adapter'

async function bootstrap() {
  dotenv.config()
  const app = await NestFactory.create(AppModule)
  app.enableCors() // NOT FOR PRODUCTION
  app.useWebSocketAdapter(new RedisIoAdapter(app))

  const options = new DocumentBuilder()
    .setTitle('NestJS API Gateway')
    .setDescription(
      'Find here the list of endpoints to communicate with the microservices/APIs'
    )
    .setVersion('1.0')
    .setSchemes('https')
    .addBearerAuth('Authorization')
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api/v1', app, document)

  await app.listen(3000)
}
bootstrap()
