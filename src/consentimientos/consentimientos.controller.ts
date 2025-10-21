import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { join } from 'path';
import { readdir } from 'fs/promises';

@Controller('consentimientos')
export class ConsentimientosController {
  @Get()
  async listar(): Promise<string[]> {
    try {
      const dir = join(process.cwd(), 'public', 'Consentimientos');
      const entries = await readdir(dir, { withFileTypes: true });
      const archivos = entries
        .filter((e) => e.isFile())
        .map((e) => e.name)
        .filter((n) => n.toLowerCase().endsWith('.html'))
        .sort((a, b) => a.localeCompare(b, 'es'));
      return archivos;
    } catch (err) {
      throw new HttpException(
        'No se pudo leer la carpeta public/Consentimientos',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
