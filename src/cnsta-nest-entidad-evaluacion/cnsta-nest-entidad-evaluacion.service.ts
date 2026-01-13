import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CnstaNestEntidadEvaluacion } from './entities/cnsta-nest-entidad-evaluacion.entity';
import { CreateCnstaNestEntidadEvaluacionDto } from './dto/create-cnsta-nest-entidad-evaluacion.dto';

@Injectable()
export class CnstaNestEntidadEvaluacionService {
  constructor(
    @InjectRepository(CnstaNestEntidadEvaluacion)
    private readonly repo: Repository<CnstaNestEntidadEvaluacion>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(documentoEntidad: string) {
    return this.repo.findOneBy({ DocumentoEntidad: documentoEntidad });
  }
 
}
