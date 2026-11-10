import { Body, Controller, Get, Post } from "@nestjs/common";
import { LivroService } from "../services/LivroService";

@Controller("livros")
export class LivroController {
  constructor(private readonly livroService: LivroService) {}

  @Post() // 1. POST /livros
  criar(@Body() body: any) {
    return this.livroService.cadastrar(body?.titulo, body?.autor);
  }

  @Get() // 2. GET /livros
  listar() {
    return this.livroService.listar();
  }
}
