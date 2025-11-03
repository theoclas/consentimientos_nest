import { Module } from '@nestjs/common';
import { FirmasController } from './firmas.controller';
import { FirmasService } from './firmas.service';

@Module({
  controllers: [FirmasController],
  providers: [FirmasService],
})
export class FirmasModule {}
