import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AppExceptionFilter } from "./errors/AppExceptionFilter";

async function bootstrap() {
  if (!process.env.DATABASE_URL) {
    console.error("A variavel de ambiente DATABASE_URL e obrigatoria.");
    process.exit(1);
  }
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AppExceptionFilter());
  const porta = Number(process.env.PORT ?? 3000);
  await app.listen(porta);
  console.log(`API da biblioteca (NestJS) rodando na porta ${porta}`);
}
bootstrap();
