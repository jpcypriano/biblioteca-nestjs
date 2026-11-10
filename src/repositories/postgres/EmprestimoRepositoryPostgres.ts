import { Inject, Injectable } from "@nestjs/common";
import { PG_POOL } from "../../database/database.constants";
import { Pool } from "pg";
import { ConflictError } from "../../errors/AppError";
import { Emprestimo } from "../../models/Emprestimo";
import { EmprestimoRepository } from "../interfaces/EmprestimoRepository";

const UNIQUE_VIOLATION = "23505";

// Converte o nome das colunas (snake_case) para o modelo (camelCase).
const COLUNAS = `
  id,
  livro_id AS "livroId",
  membro_id AS "membroId",
  data_emprestimo AS "dataEmprestimo",
  data_devolucao AS "dataDevolucao"`;

@Injectable()
export class EmprestimoRepositoryPostgres implements EmprestimoRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async criar(livroId: number, membroId: number): Promise<Emprestimo> {
    try {
      const { rows } = await this.pool.query(
        `INSERT INTO emprestimos (livro_id, membro_id) VALUES ($1, $2) RETURNING ${COLUNAS}`,
        [livroId, membroId]
      );
      return rows[0];
    } catch (erro: any) {
      // Rede de seguranca: indice unico parcial impede 2 emprestimos abertos do mesmo livro.
      if (erro.code === UNIQUE_VIOLATION) {
        throw new ConflictError("Este livro ja esta emprestado.");
      }
      throw erro;
    }
  }

  async listar(): Promise<Emprestimo[]> {
    const { rows } = await this.pool.query(
      `SELECT ${COLUNAS} FROM emprestimos ORDER BY id`
    );
    return rows;
  }

  async buscarPorId(id: number): Promise<Emprestimo | null> {
    const { rows } = await this.pool.query(
      `SELECT ${COLUNAS} FROM emprestimos WHERE id = $1`,
      [id]
    );
    return rows[0] ?? null;
  }

  async buscarAbertoPorLivro(livroId: number): Promise<Emprestimo | null> {
    const { rows } = await this.pool.query(
      `SELECT ${COLUNAS} FROM emprestimos WHERE livro_id = $1 AND data_devolucao IS NULL`,
      [livroId]
    );
    return rows[0] ?? null;
  }

  async registrarDevolucao(id: number): Promise<Emprestimo> {
    const { rows } = await this.pool.query(
      `UPDATE emprestimos SET data_devolucao = now() WHERE id = $1 RETURNING ${COLUNAS}`,
      [id]
    );
    return rows[0];
  }
}
