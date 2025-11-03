import { Injectable, BadRequestException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

interface Meta {
    tipo: 'paciente' | 'profesional' | string;
    pacienteNombre?: string;
    pacienteDoc?: string;
}

@Injectable()
export class FirmasService {
    private baseDir = join(process.cwd(), 'public', 'firmapacientes');

    async guardarPng(dataUrl: string, meta: Meta): Promise<string> {
        if (!dataUrl?.startsWith('data:image/png;base64,')) {
            throw new BadRequestException('Formato inválido: se espera PNG base64');
        }

        const b64 = dataUrl.split(',')[1];
        const buffer = Buffer.from(b64, 'base64');

        // Asegura carpeta
        await fs.mkdir(this.baseDir, { recursive: true });

        // Nombre de archivo
        const safeDoc = (meta.pacienteDoc || 'sin_doc').replace(/[^a-zA-Z0-9_-]/g, '');
        const ts = new Date().toISOString().replace(/[:]/g, '-');
        const filename = `firma_${safeDoc}_${ts}.png`;

        const filepath = join(this.baseDir, filename);
        await fs.writeFile(filepath, buffer);

        // URL pública (ServeStatic en /public => raíz /)
        const publicUrl = `/firmapacientes/${filename}`;
        return publicUrl;
    }
}
