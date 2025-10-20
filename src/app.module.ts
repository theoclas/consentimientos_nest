import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentoAnexoModule } from './documento-anexo/documento-anexo.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
      exclude: ['/api*'],
    }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'FER-DEVELOPER',
      port: 1433,
      username: 'CeereRips',
      password: 'crsoft',
      database: 'Laureles',
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
      options: {
        encrypt: false,
      },
    }),
    DocumentoAnexoModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
