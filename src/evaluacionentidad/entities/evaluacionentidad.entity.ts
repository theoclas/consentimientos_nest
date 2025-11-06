
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Evaluación Entidad' })
export class Evaluacionentidad {
  @PrimaryGeneratedColumn({ name: 'Id Evaluación Entidad' })
  idEvaluacionEntidad: number;

  @Column({ name: 'Id Tipo de Evaluación', type: 'int', nullable: true })
  idTipoEvaluacion: number;

  @Column({ name: 'Fecha Evaluación Entidad', type: 'datetime', nullable: true })
  fechaEvaluacionEntidad: Date;

  @Column({ name: 'Documento Entidad', type: 'nvarchar', length: 50, nullable: true })
  documentoEntidad: string;

  @Column({ name: 'Edad Entidad Evaluación Entidad', type: 'int', nullable: true })
  edadEntidadEvaluacion: number;

  @Column({ name: 'Diagnóstico General Evaluación Entidad', type: 'ntext', nullable: true })
  diagnosticoGeneral: string;

  @Column({ name: 'Diagnóstico Específico Evaluación Entidad', type: 'ntext', nullable: true })
  diagnosticoEspecifico: string;

  @Column({ name: 'Manejo de Medicamentos', type: 'bit', nullable: true })
  manejoMedicamentos: boolean;

  @Column({ name: 'Dirección Domicilio', type: 'nvarchar', length: 250, nullable: true })
  direccionDomicilio: string;

  @Column({ name: 'Id Ciudad', type: 'int', nullable: true })
  idCiudad: number;

  @Column({ name: 'Teléfono Domicilio', type: 'nvarchar', length: 50, nullable: true })
  telefonoDomicilio: string;

  @Column({ name: 'Fecha Nacimiento', type: 'datetime', nullable: true })
  fechaNacimiento: Date;

  @Column({ name: 'Id Unidad de Medida Edad', type: 'int', nullable: true })
  idUnidadMedidaEdad: number;

  @Column({ name: 'Id Sexo', type: 'int', nullable: true })
  idSexo: number;

  @Column({ name: 'Id Estado', type: 'int', nullable: true })
  idEstado: number;

  @Column({ name: 'Id Estado Civil', type: 'int', nullable: true })
  idEstadoCivil: number;

  @Column({ name: 'Responsable Evaluación Entidad', type: 'nvarchar', length: 250, nullable: true })
  responsableEvaluacion: string;

  @Column({ name: 'Id Parentesco Responsable', type: 'int', nullable: true })
  idParentescoResponsable: number;

  @Column({ name: 'Teléfono Responsable', type: 'nvarchar', length: 50, nullable: true })
  telefonoResponsable: string;

  @Column({ name: 'Documento Usuario', type: 'nvarchar', length: 50, nullable: true })
  documentoUsuario: string;

  @Column({ name: 'Documento Empresa', type: 'nvarchar', length: 50, nullable: true })
  documentoEmpresa: string;

  @Column({ name: 'Id Terminal', type: 'int', nullable: true })
  idTerminal: number;

  @Column({ name: 'Documento Profesional', type: 'nvarchar', length: 50, nullable: true })
  documentoProfesional: string;


}
