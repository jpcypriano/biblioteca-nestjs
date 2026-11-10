import { Membro, NovoMembro } from "../../models/Membro";

export interface MembroRepository {
  criar(novo: NovoMembro): Promise<Membro>;
  buscarPorId(id: number): Promise<Membro | null>;
  buscarPorEmail(email: string): Promise<Membro | null>;
}
export const MEMBRO_REPOSITORY = Symbol("MembroRepository");
