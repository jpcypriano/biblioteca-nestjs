export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  /** Calculado: true quando nao existe emprestimo em aberto para o livro. */
  disponivel: boolean;
}

export interface NovoLivro {
  titulo: string;
  autor: string;
}
