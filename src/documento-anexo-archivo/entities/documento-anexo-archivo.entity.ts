
import { Column, Entity, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';
// import { DocumentoAnexo } from './documento-anexo.entity';
import { DocumentoAnexo } from '../../documento-anexo/entities/documento-anexo.entity';

@Entity({ name: 'Documento Anexo Archivo' })
export class DocumentoAnexoArchivo {
  @PrimaryColumn({ name: 'Id Documento Anexo', type: 'int' })
  idDocumentoAnexo: number;

  @OneToOne(() => DocumentoAnexo, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'Id Documento Anexo',
    referencedColumnName: 'idDocumentoAnexo',
  })
  anexo: DocumentoAnexo;

  @Column('nvarchar', { name: 'Pdf Base64', nullable: true })
  pdfBase64?: string | null;

  @Column('int', { name: 'Tamano Bytes', nullable: true })
  tamanoBytes?: number | null;

  @Column('varbinary', { name: 'Hash Sha256', length: 32, nullable: true })
  hashSha256?: Buffer | null;

  @Column('datetime2', { name: 'Creado', nullable: false, default: () => 'SYSUTCDATETIME()' })
  creado!: Date;
}
