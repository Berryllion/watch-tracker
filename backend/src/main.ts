import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { INestApplication, ValidationPipe } from "@nestjs/common";

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("Watch-Tracker")
    .setDescription("Watch-Tracker API")
    .setVersion("0.1")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("swagger", app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("/api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
