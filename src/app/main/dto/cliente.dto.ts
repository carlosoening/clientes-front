import { BackupConfig } from '../model/backup-config.model';
import { Conexao } from '../model/conexao.model';
import { Contato } from '../model/contato.model';
import { Entity } from '../model/entity.model';
import { Sistema } from '../model/sistema.model';

export class ClienteDto implements Entity {

  constructor(
    public id?: number,
    public codigo?: string,
    public nome?: string,
    public email?: string,
    public febraban?: string,
    public telefone?: string,
    public tecnicoresponsavel?: string,
    public contatos?: Contato[],
    public conexoes?: Conexao[],
    public sistemas?: Sistema[],
    public backupconfigs?: BackupConfig[],
    public idsBackupConfigsExcluir?: number[],
    public idsConexoesExcluir?: number[],
    public idsContatosExcluir?: number[],
    public idsSistemasExcluir?: number[]
  ) {}

}