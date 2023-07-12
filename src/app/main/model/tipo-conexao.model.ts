import { Entity } from "./entity.model";

export class TipoConexao implements Entity {
  
  constructor(
    public id?: number,
    public codigo?: string,
    public nome?: string,
  ) {}
  
}