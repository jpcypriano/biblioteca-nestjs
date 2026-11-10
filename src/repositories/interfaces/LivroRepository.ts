import { Livro, NovoLivro } from "../../models/Livro";

export interface LivroRepository {
  criar(novo: NovoLivro): Promise<Livro>;
  listar(): Promise<Livro[]>;
  buscarPorId(id: number): Promise<Livro | null>;
}
export const LIVRO_REPOSITORY = Symbol("LivroRepository");
