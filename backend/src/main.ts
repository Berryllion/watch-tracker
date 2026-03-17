import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

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

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
