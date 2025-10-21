import { Injectable } from '@nestjs/common';
import { CreateEntidadDto } from './dto/create-entidad.dto';
import { UpdateEntidadDto } from './dto/update-entidad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Entidad } from './entities/entidad.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EntidadService {
  constructor(
    @InjectRepository(Entidad)
    private readonly entidadRepository: Repository<Entidad>,
  ) { }

  async create(createEntidadDto: CreateEntidadDto) {
    const entidad = await this.entidadRepository.create(createEntidadDto);
    await this.entidadRepository.save(entidad);
  }

  async findAll() {
    return await this.entidadRepository.find();
  }

  async findOne(documentoEntidad: string) {
    const entidad = await this.entidadRepository.findOneBy({ documentoEntidad: documentoEntidad });
    return entidad;
  }

  async update(documentoEntidad: string, updateEntidadDto: UpdateEntidadDto) {
    return await this.entidadRepository.update({ documentoEntidad }, updateEntidadDto);
    // return await this.entidadRepository.update(documentoEntidad, updateEntidadDto);
  }

  async remove(documentoEntidad: string) {
    return await this.entidadRepository.delete(documentoEntidad);
  }
}
