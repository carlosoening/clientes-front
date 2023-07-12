import { Entity } from "./entity.model";

export class TipoServidor implements Entity {
  
  constructor(
    public id?: number,
    public codigo?: string,
    public nome?: string,
  ) {}
  
}