
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'Evaluación Entidad' })
export class EvaluacionFormula {
  @PrimaryGeneratedColumn({ name: 'Id Evaluación Entidad' })
  idEvaluacionEntidad: number;

  // ====== CAMPOS "ESTÁTICOS" (defaults y se fuerzan en service) ======
  @Column({ name: 'Id Tipo de Evaluación', type: 'int', default: 3 })
  idTipoEvaluacion: number;

  @Column({ name: 'Acompañante Evaluación Entidad', type: 'nvarchar', length: 200, default: 'Sin Acompañante' })
  acompananteEvaluacionEntidad: string;

  @Column({ name: 'Id Parentesco', type: 'int', default: 1 })
  idParentesco: number;

  @Column({ name: 'Teléfono Acompañante', type: 'nvarchar', length: 30, default: '3016251171' })
  telefonoAcompanante: string;

  @Column({ name: 'Manejo de Medicamentos', type: 'bit', default: 0 })
  manejoMedicamentos: boolean;

  @Column({ name: 'Id Estado', type: 'int', default: 8 })
  idEstado: number;

  @Column({ name: 'Responsable Evaluación Entidad', type: 'nvarchar', length: 200, default: 'Yonathan Alvarez' })
  responsableEvaluacionEntidad: string;

  @Column({ name: 'Id Parentesco Responsable', type: 'int', default: 19 })
  idParentescoResponsable: number;

  @Column({ name: 'Teléfono Responsable', type: 'nvarchar', length: 30, default: '3016251171' })
  telefonoResponsable: string;

  @Column({ name: 'Id Terminal', type: 'int', default: 1459 })
  idTerminal: number;

  @Column({ name: 'Id Estado Web', type: 'int', default: 1 })
  idEstadoWeb: number;

  @Column({ name: 'Con Orden', type: 'bit', default: 0 })
  conOrden: boolean;

  @Column({ name: 'Firma Evaluación Entidad', type: 'varbinary', nullable: true })
  firmaEvaluacionEntidad: Buffer | null;

  @Column({ name: 'Sincronizado', type: 'bit', default: 0 })
  sincronizado: boolean;

  @Column({ name: 'PreguntarControl', type: 'bit', default: 0 })
  preguntarControl: boolean;

  @Column({ name: 'NombreFormatoAux', type: 'nvarchar', length: 200, nullable: true, default: null })
  nombreFormatoAux: string | null;

  @Column({ name: 'Rips', type: 'bit', default: 1 })
  rips: boolean;

  // ====== RESTO DE CAMPOS DE LA TABLA ======
  @Column({ name: 'Fecha Evaluación Entidad', type: 'datetime', nullable: true })
  fechaEvaluacionEntidad: Date | null;

  @Column({ name: 'Documento Entidad', type: 'nvarchar', length: 50, nullable: true })
  documentoEntidad: string | null;

  @Column({ name: 'Edad Entidad Evaluación Entidad', type: 'int', nullable: true })
  edadEntidadEvaluacionEntidad: number | null;

  @Column({ name: 'Diagnóstico General Evaluación Entidad', type: 'nvarchar', length: 500, nullable: true })
  diagnosticoGeneralEvaluacionEntidad: string | null;

  @Column({ name: 'Diagnóstico Específico Evaluación Entidad', type: 'nvarchar', length: 500, nullable: true })
  diagnosticoEspecificoEvaluacionEntidad: string | null;

  @Column({ name: 'Dirección Domicilio', type: 'nvarchar', length: 300, nullable: true })
  direccionDomicilio: string | null;

  @Column({ name: 'Id Ciudad', type: 'int', nullable: true })
  idCiudad: number | null;

  @Column({ name: 'Teléfono Domicilio', type: 'nvarchar', length: 30, nullable: true })
  telefonoDomicilio: string | null;

  @Column({ name: 'Fecha Nacimiento', type: 'date', nullable: true })
  fechaNacimiento: Date | null;

  @Column({ name: 'Id Unidad de Medida Edad', type: 'int', nullable: true })
  idUnidadMedidaEdad: number | null;

  @Column({ name: 'Id Sexo', type: 'int', nullable: true })
  idSexo: number | null;

  @Column({ name: 'Id Estado Civil', type: 'int', nullable: true })
  idEstadoCivil: number | null;

  @Column({ name: 'Id Ocupación', type: 'int', nullable: true })
  idOcupacion: number | null;

  @Column({ name: 'Documento Aseguradora', type: 'nvarchar', length: 50, nullable: true })
  documentoAseguradora: string | null;

  @Column({ name: 'Id Tipo de Afiliado', type: 'int', nullable: true })
  idTipoAfiliado: number | null;

  @Column({ name: 'Documento Usuario', type: 'nvarchar', length: 50, nullable: true })
  documentoUsuario: string | null;

  @Column({ name: 'Documento Empresa', type: 'nvarchar', length: 50, nullable: true })
  documentoEmpresa: string | null;

  @Column({ name: 'Documento Profesional', type: 'nvarchar', length: 50, nullable: true })
  documentoProfesional: string | null;
}
