import { Entity } from "./entity.model";

export class Sistema implements Entity {

  constructor(
    public id?: number,
    public nome?: string,
    public url?: string,
    public tipo?: string,
    public cliente_id?: number,
    public ordem?: number,
  ) {}

}