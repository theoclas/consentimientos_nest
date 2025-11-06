import { Injectable } from '@nestjs/common';
// import { CreateEmpresaDto } from './dto/create-empresa.dto';
// import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { Empresa } from './entities/empresa.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
  ) {}

  async findAll() {
    return await this.empresaRepository.find();
  }

  async findOne(documentoEmpresa: string) {
    return await this.empresaRepository.findOne({ where: { documentoEmpresa } });
  }

  

  
}
