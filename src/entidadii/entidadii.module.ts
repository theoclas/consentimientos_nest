import { Module } from '@nestjs/common';
import { EntidadiiService } from './entidadii.service';
import { EntidadiiController } from './entidadii.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntidadII } from './entities/entidadii.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntidadII])],
  controllers: [EntidadiiController],
  providers: [EntidadiiService],
})
export class EntidadiiModule {}
