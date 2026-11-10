import { Inject, Injectable } from "@nestjs/common";
import { PG_POOL } from "../../database/database.constants";
import { Pool } from "pg";
import { Livro, NovoLivro } from "../../models/Livro";
import { LivroRepository } from "../interfaces/LivroRepository";

// "disponivel" e calculado: o livro esta disponivel se nao ha emprestimo em aberto.
const SELECT_LIVRO = `
  SELECT l.id, l.titulo, l.autor,
         NOT EXISTS (
           SELECT 1 FROM emprestimos e
           WHERE e.livro_id = l.id AND e.data_devolucao IS NULL
         ) AS disponivel
  FROM livros l`;

@Injectable()
export class LivroRepositoryPostgres implements LivroRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async criar(novo: NovoLivro): Promise<Livro> {
    const { rows } = await this.pool.query(
      "INSERT INTO livros (titulo, autor) VALUES ($1, $2) RETURNING id, titulo, autor",
      [novo.titulo, novo.autor]
    );
    return { ...rows[0], disponivel: true };
  }

  async listar(): Promise<Livro[]> {
    const { rows } = await this.pool.query(`${SELECT_LIVRO} ORDER BY l.id`);
    return rows;
  }

  async buscarPorId(id: number): Promise<Livro | null> {
    const { rows } = await this.pool.query(`${SELECT_LIVRO} WHERE l.id = $1`, [id]);
    return rows[0] ?? null;
  }
}
