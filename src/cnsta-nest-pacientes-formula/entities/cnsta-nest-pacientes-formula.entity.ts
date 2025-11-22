import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'Cnsta nest Pacientes Formula', // 👈 nombre EXACTO de la vista
})
export class CnstaNestPacientesFormula {
  @ViewColumn({ name: 'Documento Entidad' })
  documentoEntidad: string;

  @ViewColumn({ name: 'Edad EntidadIII' })
  edadEntidadIII: number;

  @ViewColumn({ name: 'Dirección EntidadII' })
  direccionEntidadII: string;

  @ViewColumn({ name: 'Id Ciudad' })
  idCiudad: number;

  @ViewColumn({ name: 'Ciudad' })
  ciudad: string;

  @ViewColumn({ name: 'Teléfono No 1 EntidadII' })
  telefono1EntidadII: string;

  @ViewColumn({ name: 'Teléfono No 2 EntidadII' })
  telefono2EntidadII: string;

  @ViewColumn({ name: 'Teléfono Celular EntidadII' })
  telefonoCelularEntidadII: string;

  @ViewColumn({ name: 'Fecha Nacimiento EntidadIII' })
  fechaNacimientoEntidadIII: Date;

  @ViewColumn({ name: 'Id Unidad de Medida Edad' })
  idUnidadMedidaEdad: number;

  @ViewColumn({ name: 'Id Sexo' })
  idSexo: number;

  @ViewColumn({ name: 'Sexo' })
  sexo: string;

  @ViewColumn({ name: 'Id Estado Civil' })
  idEstadoCivil: number;

  @ViewColumn({ name: 'Estado Civil' })
  estadoCivil: string;

  @ViewColumn({ name: 'Descripción Sexo' })
  descripcionSexo: string;

  @ViewColumn({ name: 'Primer Apellido Entidad' })
  PrimerApellido: string;

  @ViewColumn({ name: 'Segundo Apellido Entidad' })
  SegundoApellido: string;

  @ViewColumn({ name: 'Primer Nombre Entidad' })
  PrimerNombre: string;

  @ViewColumn({ name: 'Segundo Nombre Entidad' })
  SegundoNombre: string;

  @ViewColumn({ name: 'Nombre Completo Entidad' })
  NombreCompleto: string;
}
