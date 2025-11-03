import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentoAnexoArchivoDto } from './create-documento-anexo-archivo.dto';

export class UpdateDocumentoAnexoArchivoDto extends PartialType(CreateDocumentoAnexoArchivoDto) {}
