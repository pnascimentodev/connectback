import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Create the NestJS application
  const app = await NestFactory.create(AppModule);

  // Configure Prisma Service for graceful shutdown
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Configure Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Product and Sales API') // Title of the API
    .setDescription('API for product and Sales Management ') // Description of the API
    .setVersion('1.0') // Version of the API
    .build();
  // Create the Swagger document based on the configuration
  const document = SwaggerModule.createDocument(app, config);
  // Setup Swagger to be available at /api-docs
  SwaggerModule.setup('api-docs', app, document);

  // Set the port and start the server
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`Server is running on: http://localhost:${port}`);
  console.log(
    `Swagger documentation available at: http://localhost:${port}/api-docs`,
  );
}

bootstrap();
