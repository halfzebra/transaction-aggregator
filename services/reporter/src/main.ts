import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Transaction Reporter API')
    .setDescription('API for accessing aggregated transaction data')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3002);

  console.log('');
  console.log(`🚀 Server running at http://localhost:3002`);
  console.log(`📚 API documentation at http://localhost:3002/api`);
  console.log('');
}
bootstrap();
