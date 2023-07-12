import { Entity } from "./entity.model";

export class Contato implements Entity {

  constructor(
    public id?: number,
    public nome?: string,
    public email?: string,
    public telefone?: string,
    public cliente_id?: number
  ) {}

}