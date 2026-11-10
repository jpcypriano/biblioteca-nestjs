import { Inject, Injectable } from "@nestjs/common";
import { ConflictError, NotFoundError, ValidationError } from "../errors/AppError";
import { Emprestimo } from "../models/Emprestimo";
import { EMPRESTIMO_REPOSITORY, EmprestimoRepository } from "../repositories/interfaces/EmprestimoRepository";
import { LIVRO_REPOSITORY, LivroRepository } from "../repositories/interfaces/LivroRepository";
import { MEMBRO_REPOSITORY, MembroRepository } from "../repositories/interfaces/MembroRepository";

function idValido(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isInteger(valor) && valor > 0;
}

@Injectable()
export class EmprestimoService {
  constructor(
    @Inject(EMPRESTIMO_REPOSITORY) private readonly emprestimoRepository: EmprestimoRepository,
    @Inject(LIVRO_REPOSITORY) private readonly livroRepository: LivroRepository,
    @Inject(MEMBRO_REPOSITORY) private readonly membroRepository: MembroRepository
  ) {}

  async emprestar(livroId: unknown, membroId: unknown): Promise<Emprestimo> {
    if (!idValido(livroId) || !idValido(membroId)) {
      throw new ValidationError("'livroId' e 'membroId' devem ser numeros inteiros positivos.");
    }

    const livro = await this.livroRepository.buscarPorId(livroId);
    if (!livro) throw new NotFoundError("Livro nao encontrado.");

    const membro = await this.membroRepository.buscarPorId(membroId);
    if (!membro) throw new NotFoundError("Membro nao encontrado.");

    const aberto = await this.emprestimoRepository.buscarAbertoPorLivro(livroId);
    if (aberto) throw new ConflictError("Este livro ja esta emprestado.");

    return this.emprestimoRepository.criar(livroId, membroId);
  }

  async devolver(id: number): Promise<Emprestimo> {
    if (!idValido(id)) {
      throw new ValidationError("O id do emprestimo deve ser um numero inteiro positivo.");
    }

    const emprestimo = await this.emprestimoRepository.buscarPorId(id);
    if (!emprestimo) throw new NotFoundError("Emprestimo nao encontrado.");
    if (emprestimo.dataDevolucao !== null) {
      throw new ConflictError("Este emprestimo ja foi devolvido.");
    }

    return this.emprestimoRepository.registrarDevolucao(id);
  }

  async listar(): Promise<Emprestimo[]> {
    return this.emprestimoRepository.listar();
  }
}
