import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { EmprestimoService } from "../services/EmprestimoService";

@Controller("emprestimos")
export class EmprestimoController {
  constructor(private readonly emprestimoService: EmprestimoService) {}

  @Post() // 4. POST /emprestimos
  emprestar(@Body() body: any) {
    return this.emprestimoService.emprestar(body?.livroId, body?.membroId);
  }

  @Post(":id/devolucao") // 5. POST /emprestimos/:id/devolucao
  @HttpCode(200)
  devolver(@Param("id") id: string) {
    return this.emprestimoService.devolver(Number(id));
  }

  @Get() // 6. GET /emprestimos
  listar() {
    return this.emprestimoService.listar();
  }
}
