import { Injectable } from '@nestjs/common';
import { CnstaNestPacientesFormula } from './entities/cnsta-nest-pacientes-formula.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CnstaNestPacientesFormulaService {

  constructor(
    @InjectRepository(CnstaNestPacientesFormula)
    private readonly cnstaNestPacientesFormulaRepository: Repository<CnstaNestPacientesFormula>,
  ) { }

  async findAll() {
    return await this.cnstaNestPacientesFormulaRepository.find();
  }

  async findOne(documentoEntidad: string) {
    return await this.cnstaNestPacientesFormulaRepository.findOneBy({ documentoEntidad });
  }

}
