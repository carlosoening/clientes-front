import { Entity } from "./entity.model";

export class Usuario implements Entity {
  
  constructor(
    public id?: number,
    public codigo?: string,
    public email?: string,
    public nome?: string,
    public senha?: string,
    public ativo?: boolean,
    public tipo?: string,
    public ip_maquina?: string
  ) {}
  
}