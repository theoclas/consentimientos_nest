import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Entidad } from 'src/entidad/entities/entidad.entity';
import { join } from 'path';

@Entity('EntidadII')
export class EntidadII {
  @PrimaryGeneratedColumn({ name: 'Id EntidadII', type: 'int' })
  idEntidadII: number;

  @Column({ name: 'Documento Entidad', type: 'nvarchar', length: 50 })
  documentoEntidad: string;

  @OneToOne(() => Entidad, { eager: true })
  @JoinColumn({ name: 'Documento Entidad', referencedColumnName: 'documentoEntidad' })
  entidad: Entidad;

  @Column({ name: 'Dirección EntidadII', type: 'nvarchar', length: 255, nullable: true })
  direccionEntidadII?: string;

  @Column({ name: 'Id Barrio', type: 'int', nullable: true })
  idBarrio?: number;

  @Column({ name: 'Teléfono No 1 EntidadII', type: 'nvarchar', length: 50, nullable: true })
  telefono1EntidadII?: string;

  @Column({ name: 'Teléfono No 2 EntidadII', type: 'nvarchar', length: 50, nullable: true })
  telefono2EntidadII?: string;

  @Column({ name: 'Teléfono Celular EntidadII', type: 'nvarchar', length: 50, nullable: true })
  telefonoCelularEntidadII?: string;

  @Column({ name: 'Id Empresa Celular', type: 'int', nullable: true })
  idEmpresaCelular?: number;

  @Column({ name: 'Beeper EntidadII', type: 'nvarchar', length: 50, nullable: true })
  beeperEntidadII?: string;

  @Column({ name: 'E-mail Nro 1 EntidadII', type: 'nvarchar', length: 100, nullable: true })
  emailEntidadII?: string;

  @Column({ name: 'Id Zona Ubicación', type: 'int', nullable: true })
  idZonaUbicacion?: number;

  @Column({ name: 'Id Ciudad', type: 'int', nullable: true })
  idCiudad?: number;
}
