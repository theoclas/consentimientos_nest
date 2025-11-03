import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Documento Anexo' }) // 👈 importante: coincide con el nombre exacto de la tabla en SQL Server
export class DocumentoAnexo {
  @PrimaryGeneratedColumn({ name: 'Id Documento Anexo' })
  idDocumentoAnexo: number;

  @Column('nvarchar', { name: 'Documento Entidad', length: 50, nullable: true })
  documentoEntidad?: string;

  @Column('nvarchar', { name: 'Documento Anexo', length: 250, nullable: true })
  documentoAnexo?: string;

  @Column('nvarchar', {
    name: 'Descripción Documento Anexo',
    length: 250,
    nullable: true,
  })
  descripcionDocumentoAnexo?: string;

  // @Column('datetime', { name: 'Fecha Documento Anexo', nullable: true })
  // fechaDocumentoAnexo?: Date;

  @Column('datetime', {
    name: 'Fecha Documento Anexo',
    nullable: false,
    default: () => 'GETDATE()'
  })
  fechaDocumentoAnexo!: Date;

  @Column('nvarchar', { name: 'Documento Empresa', length: 50, nullable: true })
  documentoEmpresa?: string;

  @Column('int', { name: 'Id Terminal', nullable: true })
  idTerminal?: number;

  @Column('int', { name: 'Id Estado', nullable: true })
  idEstado?: number;

  @Column('nvarchar', { name: 'RutaCarpeta', length: 250, nullable: true })
  rutaCarpeta?: string;



}
