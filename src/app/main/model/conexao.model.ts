import { Entity } from "./entity.model";

export class Conexao implements Entity {

  constructor(
    public id?: number,
    public tipoconexao_id?: number,
    public ip?: string,
    public usuario?: string,
    public senha?: string,
    public cliente_id?: number
  ) {}

}