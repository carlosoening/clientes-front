import { Entity } from "./entity.model";

export class Cliente implements Entity {

  constructor(
    public id?: number,
    public codigo?: string,
    public nome?: string,
    public email?: string,
    public febraban?: string,
    public telefone?: string,
    public tecnicoresponsavel?: string
  ) {}

}