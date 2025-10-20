import { Injectable } from '@nestjs/common';
import { CreateDocumentoAnexoDto } from './dto/create-documento-anexo.dto';
import { UpdateDocumentoAnexoDto } from './dto/update-documento-anexo.dto';
import { DocumentoAnexo } from './entities/documento-anexo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentoAnexoService {
  constructor(
    @InjectRepository(DocumentoAnexo)
    private readonly documentoAnexoRepository: Repository<DocumentoAnexo>,
  ) {}

  async create(createDocumentoAnexoDto: CreateDocumentoAnexoDto) {
    const documentoAnexo = await this.documentoAnexoRepository.create(
      createDocumentoAnexoDto,
    );
    return this.documentoAnexoRepository.save(documentoAnexo);
  }

  async findAll() {
    return await this.documentoAnexoRepository.find();
  }

  async findOne(idDocumentoAnexo: number) {
    return await this.documentoAnexoRepository.findOneBy({ idDocumentoAnexo });
  }

  async update(
    idDocumentoAnexo: number,
    updateDocumentoAnexoDto: UpdateDocumentoAnexoDto,
  ) {
    return await this.documentoAnexoRepository.update(
      idDocumentoAnexo,
      updateDocumentoAnexoDto,
    );
  }

  async remove(idDocumentoAnexo: number) {
    return await this.documentoAnexoRepository.delete(idDocumentoAnexo);
  }
}
