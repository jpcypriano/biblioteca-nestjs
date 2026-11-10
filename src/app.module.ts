import { Module } from "@nestjs/common";
import { Pool } from "pg";
import { EmprestimoController } from "./controllers/EmprestimoController";
import { LivroController } from "./controllers/LivroController";
import { MembroController } from "./controllers/MembroController";
import { PG_POOL } from "./database/database.constants";
import { EMPRESTIMO_REPOSITORY } from "./repositories/interfaces/EmprestimoRepository";
import { LIVRO_REPOSITORY } from "./repositories/interfaces/LivroRepository";
import { MEMBRO_REPOSITORY } from "./repositories/interfaces/MembroRepository";
import { EmprestimoRepositoryPostgres } from "./repositories/postgres/EmprestimoRepositoryPostgres";
import { LivroRepositoryPostgres } from "./repositories/postgres/LivroRepositoryPostgres";
import { MembroRepositoryPostgres } from "./repositories/postgres/MembroRepositoryPostgres";
import { EmprestimoService } from "./services/EmprestimoService";
import { LivroService } from "./services/LivroService";
import { MembroService } from "./services/MembroService";

/**
 * Modulo unico da aplicacao (monolito). Aqui o container de DI do NestJS e configurado:
 * "quando alguem pedir o token X, entregue a classe Y".
 * E o unico lugar que liga as interfaces de repositorio as implementacoes Postgres.
 */
@Module({
  controllers: [LivroController, MembroController, EmprestimoController],
  providers: [
    // Camada de dados
    { provide: PG_POOL, useFactory: () => new Pool({ connectionString: process.env.DATABASE_URL }) },
    { provide: LIVRO_REPOSITORY, useClass: LivroRepositoryPostgres },
    { provide: MEMBRO_REPOSITORY, useClass: MembroRepositoryPostgres },
    { provide: EMPRESTIMO_REPOSITORY, useClass: EmprestimoRepositoryPostgres },
    // Camada de negocio
    LivroService,
    MembroService,
    EmprestimoService,
  ],
})
export class AppModule {}
