import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('Entidad')
export class Entidad {
  @Column({ name: 'Id Entidad', type: 'int', generated: 'increment' })
  idEntidad: number;

  @PrimaryColumn({ name: 'Documento Entidad', type: 'nvarchar', length: 50 })
  documentoEntidad: string;

  @Column({ name: 'Id Tipo de Documento', type: 'int' })
  idTipoDocumento: number;

  @Column({ name: 'Primer Apellido Entidad', type: 'nvarchar', length: 100, nullable: true })
  primerApellidoEntidad?: string;

  @Column({ name: 'Segundo Apellido Entidad', type: 'nvarchar', length: 100, nullable: true })
  segundoApellidoEntidad?: string;

  @Column({ name: 'Primer Nombre Entidad', type: 'nvarchar', length: 100, nullable: true })
  primerNombreEntidad?: string;

  @Column({ name: 'Segundo Nombre Entidad', type: 'nvarchar', length: 50, nullable: true })
  segundoNombreEntidad?: string;

  @Column({ name: 'Observaciones Entidad', type: 'nvarchar', length: 255, nullable: true })
  observacionesEntidad?: string;

  @Column({ name: 'Foto Entidad', type: 'nvarchar', length: 100, nullable: true })
  fotoEntidad?: string;

  @Column({ name: 'Id Estado', type: 'int', nullable: true })
  idEstado?: number;

  @Column({ name: 'Nombre Completo Entidad', type: 'nvarchar', length: 250, nullable: true })
  nombreCompletoEntidad?: string;

  @Column({ name: 'Registro Médico', type: 'nvarchar', length: 50, nullable: true })
  registroMedico?: string;

  @Column({ name: 'Firma Entidad', type: 'nvarchar', length: 100, nullable: true })
  firmaEntidad?: string;


}
