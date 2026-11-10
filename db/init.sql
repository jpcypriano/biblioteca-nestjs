CREATE TABLE livros (
  id     SERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  autor  VARCHAR(150) NOT NULL
);

CREATE TABLE membros (
  id    SERIAL PRIMARY KEY,
  nome  VARCHAR(150) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE
);

CREATE TABLE emprestimos (
  id              SERIAL PRIMARY KEY,
  livro_id        INTEGER NOT NULL REFERENCES livros(id),
  membro_id       INTEGER NOT NULL REFERENCES membros(id),
  data_emprestimo TIMESTAMPTZ NOT NULL DEFAULT now(),
  data_devolucao  TIMESTAMPTZ
);

-- Garante no banco que um livro nao tem dois emprestimos em aberto ao mesmo tempo.
CREATE UNIQUE INDEX emprestimo_aberto_por_livro
  ON emprestimos (livro_id)
  WHERE data_devolucao IS NULL;
