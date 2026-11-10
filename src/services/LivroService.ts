import { Inject, Injectable } from "@nestjs/common";
import { ValidationError } from "../errors/AppError";
import { Livro } from "../models/Livro";
import { LIVRO_REPOSITORY, LivroRepository } from "../repositories/interfaces/LivroRepository";

@Injectable()
export class LivroService {
  // Depende da INTERFACE (DIP) e recebe a implementacao de fora (injecao de dependencia).
  constructor(@Inject(LIVRO_REPOSITORY) private readonly livroRepository: LivroRepository) {}

  async cadastrar(titulo: unknown, autor: unknown): Promise<Livro> {
    if (typeof titulo !== "string" || titulo.trim() === "") {
      throw new ValidationError("O campo 'titulo' e obrigatorio.");
    }
    if (typeof autor !== "string" || autor.trim() === "") {
      throw new ValidationError("O campo 'autor' e obrigatorio.");
    }
    return this.livroRepository.criar({ titulo: titulo.trim(), autor: autor.trim() });
  }

  async listar(): Promise<Livro[]> {
    return this.livroRepository.listar();
  }
}
