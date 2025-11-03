import { Body, Controller, Post } from '@nestjs/common';
import { FirmasService } from './firmas.service';
import { GuardarFirmaPacienteDto } from './dto/guardar-firma-paciente.dto';

@Controller('firmas') // recuerda: sin "api", porque ya tienes app.setGlobalPrefix('api')
export class FirmasController {
  constructor(private readonly service: FirmasService) {}

  @Post('paciente')
  async guardarFirmaPaciente(@Body() dto: GuardarFirmaPacienteDto) {
    const url = await this.service.guardarPng(dto.imagenBase64, {
      tipo: 'paciente',
      pacienteNombre: dto.pacienteNombre ?? 'paciente',
      pacienteDoc: dto.pacienteDoc ?? 'sin_doc',
    });
    return { url };
  }
}
