import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('Empresa')
export class Empresa {
  @Column({ name: 'Id Empresa', type: 'int', generated: 'increment' })
  idEmpresa: number;

  @PrimaryColumn({ name: 'Documento Empresa', type: 'nvarchar', length: 50 })
  documentoEmpresa: string;

  @Column({ name: 'Id Tipo de Documento', type: 'int', nullable: true })
  idTipoDocumento?: number;

  @Column({ name: 'Id Ciudad', type: 'int', nullable: true })
  idCiudad?: number;

  @Column({ name: 'Nombre Comercial Empresa', type: 'nvarchar', length: 100, nullable: true })
  nombreComercialEmpresa?: string;

  @Column({ name: 'Razon Social Empresa', type: 'nvarchar', length: 100, nullable: true })
  razonSocialEmpresa?: string;

  @Column({ name: 'Código Empresa', type: 'nvarchar', length: 50, nullable: true })
  codigoEmpresa?: string;

  @Column({ name: 'Observaciones Empresa', type: 'nvarchar', length: 200, nullable: true })
  observacionesEmpresa?: string;
}
