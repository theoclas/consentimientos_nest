import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Cnsta Nest Objetos Medicamentos' }) // nombre real en SQL Server
export class Medicamento {
  @PrimaryColumn({ name: 'Código Objeto', type: 'varchar' })
  codigoObjeto: string;

  @Column({ name: 'Capítulo', type: 'varchar', nullable: true })
  capitulo: string;

  @Column({ name: 'Subcapítulo', type: 'varchar', nullable: true })
  subcapitulo: string;

  @Column({ name: 'Descripción Objeto', type: 'varchar', nullable: true })
  descripcionObjeto: string;
}
