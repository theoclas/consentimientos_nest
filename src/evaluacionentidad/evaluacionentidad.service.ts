import { Injectable } from '@nestjs/common';
import { CreateEvaluacionentidadDto } from './dto/create-evaluacionentidad.dto';
// import { UpdateEvaluacionentidadDto } from './dto/update-evaluacionentidad.dto';
import { Repository } from 'typeorm';
import { Evaluacionentidad } from './entities/evaluacionentidad.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EvaluacionentidadService {
  constructor(
    @InjectRepository(Evaluacionentidad)
    private readonly evaluacionentidadRepository: Repository<Evaluacionentidad>,
  ) { }
  async create(createEvaluacionentidadDto: CreateEvaluacionentidadDto) {
    const evaluacionentidad = await this.evaluacionentidadRepository.create(createEvaluacionentidadDto);
    return this.evaluacionentidadRepository.save(evaluacionentidad);
  }

  async findAll() {
    return await this.evaluacionentidadRepository.find();
  }

  async findOne(idEvaluacionEntidad: number) {
    return await this.evaluacionentidadRepository.findOneBy({ idEvaluacionEntidad: idEvaluacionEntidad });
  }

  // async update(id: number, updateEvaluacionentidadDto: UpdateEvaluacionentidadDto) {
  //   return `This action updates a #${id} evaluacionentidad`;
  // }

  async remove(idEvaluacionEntidad: number) {
    return await this.evaluacionentidadRepository.delete(idEvaluacionEntidad);
  }
}
