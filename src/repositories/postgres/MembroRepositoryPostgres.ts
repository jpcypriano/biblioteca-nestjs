import { Inject, Injectable } from "@nestjs/common";
import { PG_POOL } from "../../database/database.constants";
import { Pool } from "pg";
import { ConflictError } from "../../errors/AppError";
import { Membro, NovoMembro } from "../../models/Membro";
import { MembroRepository } from "../interfaces/MembroRepository";

const UNIQUE_VIOLATION = "23505";

@Injectable()
export class MembroRepositoryPostgres implements MembroRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async criar(novo: NovoMembro): Promise<Membro> {
    try {
      const { rows } = await this.pool.query(
        "INSERT INTO membros (nome, email) VALUES ($1, $2) RETURNING id, nome, email",
        [novo.nome, novo.email]
      );
      return rows[0];
    } catch (erro: any) {
      if (erro.code === UNIQUE_VIOLATION) {
        throw new ConflictError("Ja existe um membro com esse e-mail.");
      }
      throw erro;
    }
  }

  async buscarPorId(id: number): Promise<Membro | null> {
    const { rows } = await this.pool.query(
      "SELECT id, nome, email FROM membros WHERE id = $1",
      [id]
    );
    return rows[0] ?? null;
  }

  async buscarPorEmail(email: string): Promise<Membro | null> {
    const { rows } = await this.pool.query(
      "SELECT id, nome, email FROM membros WHERE email = $1",
      [email]
    );
    return rows[0] ?? null;
  }
}
