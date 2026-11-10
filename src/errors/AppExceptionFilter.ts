import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from "express";
import { AppError } from "./AppError";

/** Converte erros da aplicacao em respostas HTTP no formato { erro: "..." }. */
@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(erro: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    if (erro instanceof AppError) {
      res.status(erro.status).json({ erro: erro.message });
      return;
    }
    if (erro instanceof HttpException) {
      const status = erro.getStatus();
      const mensagem =
        status === 404 ? "Rota nao encontrada." : status === 400 ? "Requisicao invalida." : erro.message;
      res.status(status).json({ erro: mensagem });
      return;
    }
    console.error(erro);
    res.status(500).json({ erro: "Erro interno do servidor." });
  }
}
