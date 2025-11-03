import { Injectable } from '@nestjs/common';
import { CreateDocumentoAnexoDto } from './dto/create-documento-anexo.dto';
import { UpdateDocumentoAnexoDto } from './dto/update-documento-anexo.dto';
import { DocumentoAnexo } from './entities/documento-anexo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentoAnexoArchivo } from '../documento-anexo-archivo/entities/documento-anexo-archivo.entity';

@Injectable()
export class DocumentoAnexoService {
  constructor(
    @InjectRepository(DocumentoAnexo)
    private readonly documentoAnexoRepository: Repository<DocumentoAnexo>,
    @InjectRepository(DocumentoAnexoArchivo)
    private readonly archivoRepo: Repository<DocumentoAnexoArchivo>,
  ) { }

  async create(createDocumentoAnexoDto: CreateDocumentoAnexoDto) {
    const documentoAnexo = await this.documentoAnexoRepository.create(
      createDocumentoAnexoDto,
      
    );
    return this.documentoAnexoRepository.save(documentoAnexo);
  }

  // async create(dto: CreateDocumentoAnexoDto | any): Promise<DocumentoAnexo> {
  //   const entity = this.documentoAnexoRepository.create(dto as any);
  //   return this.documentoAnexoRepository.save(entity);
  // }

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

  async saveArchivoBase64(
    idDocumentoAnexo: number,
    pdfBase64: string,
    tamanoBytes?: number,
    hashSha256?: Buffer,
  ): Promise<DocumentoAnexoArchivo> {
    const archivo = this.archivoRepo.create({
      idDocumentoAnexo,
      pdfBase64,
      tamanoBytes: tamanoBytes ?? null,
      hashSha256: hashSha256 ?? null,
    });
    return this.archivoRepo.save(archivo);
  }
}
