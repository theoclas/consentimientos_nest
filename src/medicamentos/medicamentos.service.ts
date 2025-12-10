import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Medicamento } from './entities/medicamento.entity';

@Injectable()
export class MedicamentosService {
  constructor(
    @InjectRepository(Medicamento)
    private readonly medicamentosRepository: Repository<Medicamento>,
  ) {}

  async buscarbydescripcion(descripcionObjeto: string): Promise<Medicamento[]> {
    const termino = (descripcionObjeto ?? '').trim();

    if (!termino) {
      return [];
    }

    const resultados = await this.medicamentosRepository.find({
      where: {
        descripcionObjeto: Like(`%${termino}%`),
      },
      take: 20,
      order: { descripcionObjeto: 'ASC' },
    });

    // Solo para depurar:
    console.log('TÉRMINO BUSCADO:', termino);
    console.log('CANTIDAD RESULTADOS:', resultados.length);

    return resultados; // 👈 SIEMPRE array
  }
}
