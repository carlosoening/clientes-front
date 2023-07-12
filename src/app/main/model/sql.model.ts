import { Entity } from "./entity.model";

export class Sql implements Entity {
  
  constructor(
    public id?: number,
    public codigo?: string,
    public descricao?: string,
    public sql?: string,
  ) {}
  
}