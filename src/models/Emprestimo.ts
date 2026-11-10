export interface Emprestimo {
  id: number;
  livroId: number;
  membroId: number;
  dataEmprestimo: Date;
  /** null enquanto o livro ainda nao foi devolvido. */
  dataDevolucao: Date | null;
}
