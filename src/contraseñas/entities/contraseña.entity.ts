// src/entities/contrasena.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Contraseña', schema: 'dbo' })
export class Contraseña {
  @PrimaryGeneratedColumn({ type: 'int', name: 'Id Contraseña' })
  idContrasena: number;

  @Column('nvarchar', { name: 'Documento Entidad', length: 50 })
  documentoEntidad: string;

  @Column('nvarchar', { name: 'Nombre de Usuario', length: 50 })
  nombreDeUsuario: string;

  @Column('nvarchar', { name: 'Contraseña', length: 50, nullable: true })
  contrasena: string | null;

  @Column('int', { name: 'Id Nivel', nullable: true })
  idNivel: number | null;

  @Column('int', { name: 'Id Estado', nullable: true })
  idEstado: number | null;

  @Column('nvarchar', {
    name: 'Documento Cambio Contraseña',
    length: 50,
    nullable: true,
  })
  documentoCambioContrasena: string | null;

  @Column('bit', { name: 'ver_nota_aclaratoria', nullable: true })
  verNotaAclaratoria: boolean | null;
}
