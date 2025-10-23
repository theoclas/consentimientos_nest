
import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'Cnsta Nest Profesional info general', // 👈 usa el nombre EXACTO de la vista en SQL Server
})
export class Profesional {
  @ViewColumn({ name: 'Documento Profesional' })
  documentoProfesional: string;

  @ViewColumn({ name: 'Tipo de Documento Profesional' })
  tipoDocumentoProfesional: string;

  @ViewColumn({ name: 'Descripción Tipo de Documento Profesional' })
  descripcionTipoDocumentoProfesional: string;

  @ViewColumn({ name: 'Nombres Profesional' })
  nombresProfesional: string;

  @ViewColumn({ name: 'Dirección Profesional' })
  direccionProfesional: string;

  @ViewColumn({ name: 'Barrio Profesional' })
  barrioProfesional: string;

  @ViewColumn({ name: 'Ciudad Profesional' })
  ciudadProfesional: string;

  @ViewColumn({ name: 'Teléfono No 1 Profesional' })
  telefono1Profesional: string;

  @ViewColumn({ name: 'Teléfono No 2 Profesional' })
  telefono2Profesional: string;

  @ViewColumn({ name: 'Teléfono Celular Profesional' })
  telefonoCelularProfesional: string;

  @ViewColumn({ name: 'Empresa Celular Profesional' })
  empresaCelularProfesional: string;

  @ViewColumn({ name: 'Beeper Profesional' })
  beeperProfesional: string;

  @ViewColumn({ name: 'E-mail Profesional' })
  emailProfesional: string;

  @ViewColumn({ name: 'Sigla Profesional' })
  siglaProfesional: string;

  @ViewColumn({ name: 'Registro Médico' })
  registroMedico: string;
}
