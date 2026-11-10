import { Inject, Injectable } from "@nestjs/common";
import { ConflictError, ValidationError } from "../errors/AppError";
import { Membro } from "../models/Membro";
import { MEMBRO_REPOSITORY, MembroRepository } from "../repositories/interfaces/MembroRepository";

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Injectable()
export class MembroService {
  constructor(@Inject(MEMBRO_REPOSITORY) private readonly membroRepository: MembroRepository) {}

  async cadastrar(nome: unknown, email: unknown): Promise<Membro> {
    if (typeof nome !== "string" || nome.trim() === "") {
      throw new ValidationError("O campo 'nome' e obrigatorio.");
    }
    if (typeof email !== "string" || !EMAIL_VALIDO.test(email.trim())) {
      throw new ValidationError("O campo 'email' e obrigatorio e deve ser valido.");
    }

    const emailNormalizado = email.trim().toLowerCase();
    const existente = await this.membroRepository.buscarPorEmail(emailNormalizado);
    if (existente) {
      throw new ConflictError("Ja existe um membro com esse e-mail.");
    }

    return this.membroRepository.criar({ nome: nome.trim(), email: emailNormalizado });
  }
}
