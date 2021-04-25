import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(console);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: {
      strategy: 'exposeAll',
      enableImplicitConversion: true,
    },
  }));


  const options = new DocumentBuilder()
    .setTitle('EPC')
    .setVersion('1.0')
    .addTag('EPC network API description')
    .addBearerAuth({ type: 'http' }, 'Authorization')
    // .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('api', app, document);

  const configService: ConfigService = app.get('ConfigService');
  const port = configService ? configService.get('PORT') : 8080;


  await app.listen(port).then(async () => {
    console.info(`Server up on ${await app.getUrl()}`);
  }).catch(er => {
    console.error(er);
  });
}

bootstrap();
