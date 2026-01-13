import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { CreateEvaluacionFormulaDto } from './dto/create-evaluacion-formula.dto';
import { UpdateEvaluacionFormulaDto } from './dto/update-evaluacion-formula.dto';
import { EvaluacionFormula } from './entities/evaluacion-formula.entity';

@Injectable()
export class EvaluacionFormulaService {
  constructor(
    @InjectRepository(EvaluacionFormula)
    private readonly repo: Repository<EvaluacionFormula>,
  ) { }

  async create(dto: CreateEvaluacionFormulaDto) {
    // Fuerza SIEMPRE los campos estáticos
    const entity = this.repo.create({
      ...dto,
      // defaults hard-enforced:
      idTipoEvaluacion: 2,
      acompananteEvaluacionEntidad: 'Sin Acompañante',
      idParentesco: 1,
      telefonoAcompanante: '999',
      manejoMedicamentos: false,
      idEstado: 8,
      responsableEvaluacionEntidad: 'Yonathan Alvarez',
      idParentescoResponsable: 19,
      telefonoResponsable: '999',
      idTerminal: 1459,
      idEstadoWeb: 1,
      conOrden: false,
      firmaEvaluacionEntidad: null,
      sincronizado: false,
      preguntarControl: false,
      nombreFormatoAux: null,
      rips: true,
      // parse fechas si llegan string
      fechaEvaluacionEntidad: dto.fechaEvaluacionEntidad ? new Date(dto.fechaEvaluacionEntidad) : null,
      fechaNacimiento: dto.fechaNacimiento ? new Date(dto.fechaNacimiento) : null,
    });

    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ order: { idEvaluacionEntidad: 'DESC' } });
  }

  async findOne(id: number) {
    const found = await this.repo.findOne({ where: { idEvaluacionEntidad: id } });
    if (!found) throw new NotFoundException(`No existe Evaluación Entidad con id=${id}`);
    return found;
  }

  async update(id: number, dto: UpdateEvaluacionFormulaDto) {
    const existing = await this.findOne(id);

    // solo permitimos modificar NO-estáticos
    const patch: Partial<EvaluacionFormula> = {
      ...dto,
      fechaEvaluacionEntidad: dto.fechaEvaluacionEntidad ? new Date(dto.fechaEvaluacionEntidad) : existing.fechaEvaluacionEntidad,
      fechaNacimiento: dto.fechaNacimiento ? new Date(dto.fechaNacimiento) : existing.fechaNacimiento,
    };

    Object.assign(existing, patch);

    // re-forzar estáticos por seguridad
    existing.idTipoEvaluacion = 2;
    existing.acompananteEvaluacionEntidad = 'Sin Acompañante';
    existing.idParentesco = 1;
    existing.telefonoAcompanante = '3016251171';
    existing.manejoMedicamentos = false;
    existing.idEstado = 8;
    existing.responsableEvaluacionEntidad = 'Yonathan Alvarez';
    existing.idParentescoResponsable = 19;
    existing.telefonoResponsable = '3016251171';
    existing.idTerminal = 1459;
    existing.idEstadoWeb = 1;
    existing.conOrden = false;
    existing.firmaEvaluacionEntidad = null;
    existing.sincronizado = false;
    existing.preguntarControl = false;
    existing.nombreFormatoAux = null;
    existing.rips = true;

    return this.repo.save(existing);
  }

  async remove(id: number) {
    const existing = await this.findOne(id);
    await this.repo.remove(existing);
    return { deleted: true, id };
  }
}
