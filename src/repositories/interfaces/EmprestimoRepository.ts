import { Emprestimo } from "../../models/Emprestimo";

export interface EmprestimoRepository {
  criar(livroId: number, membroId: number): Promise<Emprestimo>;
  listar(): Promise<Emprestimo[]>;
  buscarPorId(id: number): Promise<Emprestimo | null>;
  buscarAbertoPorLivro(livroId: number): Promise<Emprestimo | null>;
  registrarDevolucao(id: number): Promise<Emprestimo>;
}
export const EMPRESTIMO_REPOSITORY = Symbol("EmprestimoRepository");
