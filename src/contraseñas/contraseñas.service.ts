import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contraseña } from './entities/contraseña.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContraseñasService {
    constructor(
        @InjectRepository(Contraseña)
        private readonly contrasenaRepository: Repository<Contraseña>,
    ) { }

    findContrasenaBynombreDeUsuario(nombreDeUsuario: string): Promise<Contraseña | null> {
        return this.contrasenaRepository.findOne({ where: { nombreDeUsuario: nombreDeUsuario } });
    }

    findbynombreDeUsuariowithcontraseña(nombreDeUsuario: string): Promise<Contraseña | null> {
        return this.contrasenaRepository.findOne({ where: { nombreDeUsuario: nombreDeUsuario }, select: ['contrasena', 'nombreDeUsuario', 'documentoEntidad'] });
    }
}
