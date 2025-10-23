import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profesional } from './entities/profesionale.entity';
import { Repository } from 'typeorm';


@Injectable()
export class ProfesionalesService {
  constructor(
    @InjectRepository(Profesional)
    private readonly profesionalesRepository: Repository<Profesional>, 
  ) {}
 

  async findAll() {
    return await this.profesionalesRepository.find();
  }

  async findOne(documentoProfesional: string) {
    return await this.profesionalesRepository.findOneBy({ documentoProfesional: documentoProfesional });
  }

  
}
