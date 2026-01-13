 
import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'cnsta Nest entidad evaluacion' })
export class CnstaNestEntidadEvaluacion {


  @ViewColumn({ name: 'DocumentoEntidad' })
  DocumentoEntidad: string;

  @ViewColumn({ name: 'EDAD' })
  edad: number;

  @ViewColumn({ name: 'DIRECCION' })
  direccion: string;

  @ViewColumn({ name: 'CIUDAD' })
  ciudad: number;

  @ViewColumn({ name: 'TELEFONO' })
  telefono: string;

  @ViewColumn({ name: 'FECHA NACIMIENTO' })
  fechaNacimiento: Date;

  @ViewColumn({ name: 'Id Unidad de Medida Edad' })
  idUnidadMedidaEdad: number;

  @ViewColumn({ name: 'SEXO' })
  sexo: number;

  @ViewColumn({ name: 'ESTADO CIVIL' })
  estadoCivil: number;

  @ViewColumn({ name: 'OCUPACION' })
  ocupacion: number;

  @ViewColumn({ name: 'DOC ASEGURADORA' })
  docAseguradora: string;

  @ViewColumn({ name: 'Id Tipo de Afiliado' })
  idTipoAfiliado: number;

  @ViewColumn({ name: 'RESPONSABLE' })
  responsable: string;

  @ViewColumn({ name: 'ID PAREN' })
  idParen: number;

  @ViewColumn({ name: 'TELEFOJO RES' })
  telefonoRes: number;

  @ViewColumn({ name: 'DOC USUARIO' })
  docUsuario: string;

  @ViewColumn({ name: 'DOC EMPRESA' })
  docEmpresa: string;

  @ViewColumn({ name: 'DOC PROFE' })
  docProfe: string;
}
