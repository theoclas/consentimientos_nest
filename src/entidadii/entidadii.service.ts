import { Injectable } from '@nestjs/common';
import { CreateEntidadIIDto } from './dto/create-entidadii.dto';
import { UpdateEntidadIIDto } from './dto/update-entidadii.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntidadII } from './entities/entidadii.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EntidadiiService {

  constructor(
    @InjectRepository(EntidadII)
     private readonly entidadiiRepository: Repository<EntidadII>,
  ) {}

  async create(createEntidadiiDto: CreateEntidadIIDto) {
    const entidadii = await this.entidadiiRepository.create(createEntidadiiDto);
    await this.entidadiiRepository.save(entidadii); 
  }

  async findAll() {
    return await this.entidadiiRepository.find();
  }

  async findOne(documentoEntidad: string) {
    return await this.entidadiiRepository.findOneBy({ documentoEntidad: documentoEntidad  });
  }

  async update(documentoEntidad: string, updateEntidadiiDto: UpdateEntidadIIDto) {
    return await this.entidadiiRepository.update(documentoEntidad, updateEntidadiiDto);
  }

  async remove(documentoEntidad: string) {
    return await this.entidadiiRepository.delete(documentoEntidad);
  }
}
