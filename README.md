# Biblioteca - Monolito em Camadas (NestJS)

Trabalho semestral de Arquitetura de Software (Prof. Maikon Bueno, 2026/2) - **Organizacao A: Monolito em camadas**.

API REST de uma biblioteca: cadastro de livros e membros, emprestimo e devolucao. Feita com **NestJS** + PostgreSQL.

## Como executar

Requisito: Docker com Docker Compose.

```bash
docker compose up --build
```

- API: http://localhost:3000
- PostgreSQL (container proprio `biblioteca-nest-db`): `localhost:5433` (usuario/senha/banco: `biblioteca`)
- Para zerar o banco: `docker compose down -v`

## Rotas

| Metodo | Rota                          | Descricao                               |
|--------|-------------------------------|-----------------------------------------|
| POST   | `/livros`                     | Cadastra livro (`titulo`, `autor`)      |
| GET    | `/livros`                     | Lista livros (com campo `disponivel`)   |
| POST   | `/membros`                    | Cadastra membro (`nome`, `email`)       |
| POST   | `/emprestimos`                | Empresta livro (`livroId`, `membroId`)  |
| POST   | `/emprestimos/:id/devolucao`  | Devolve livro                           |
| GET    | `/emprestimos`                | Lista emprestimos                       |

## Exemplo de uso

```bash
curl -X POST localhost:3000/livros -H "Content-Type: application/json" \
  -d '{"titulo":"Clean Architecture","autor":"Robert C. Martin"}'

curl -X POST localhost:3000/membros -H "Content-Type: application/json" \
  -d '{"nome":"Maria Silva","email":"maria@email.com"}'

curl -X POST localhost:3000/emprestimos -H "Content-Type: application/json" \
  -d '{"livroId":1,"membroId":1}'

curl localhost:3000/livros

curl -X POST localhost:3000/emprestimos/1/devolucao
```

## Arquitetura

```
Controllers (apresentacao)  ->  Services (negocio)  ->  Repositories (dados)  ->  PostgreSQL
                                        |                      ^
                                        v                      |
                              interfaces de repositorio  <-- implementadas por Repository*Postgres
```

- **Camadas fechadas:** cada camada so conversa com a imediatamente abaixo.
- **DIP:** os services dependem de interfaces (`src/repositories/interfaces`), nao do Postgres.
- **Injecao de dependencia:** container de DI do NestJS, configurado em `src/app.module.ts`
  (tokens `*_REPOSITORY` ligados as implementacoes Postgres).

## Estrutura

```
src/
  controllers/   camada de apresentacao (HTTP, decorators do Nest)
  services/      camada de negocio (regras)
  repositories/
    interfaces/  contratos + tokens de injecao (DIP)
    postgres/    implementacoes com PostgreSQL
  models/        entidades: Livro, Membro, Emprestimo
  errors/        erros de aplicacao (400, 404, 409) e filtro que os converte em HTTP
  database/      token de injecao do Pool do PostgreSQL
  app.module.ts  modulo unico: configura a injecao de dependencia
  main.ts        ponto de entrada
db/init.sql      criacao das tabelas
Dockerfile       imagem da aplicacao
docker-compose.yml  app + banco (containers separados)
```
