import { Body, Controller, Post } from "@nestjs/common";
import { MembroService } from "../services/MembroService";

@Controller("membros")
export class MembroController {
  constructor(private readonly membroService: MembroService) {}

  @Post() // 3. POST /membros
  criar(@Body() body: any) {
    return this.membroService.cadastrar(body?.nome, body?.email);
  }
}
