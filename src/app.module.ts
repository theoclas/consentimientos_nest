import { Module, RequestMethod } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentoAnexoModule } from './documento-anexo/documento-anexo.module';
import { AuthModule } from './auth/auth.module';
import { ContraseñasModule } from './contraseñas/contraseñas.module';
import { ConsentimientosController } from './consentimientos/consentimientos.controller';
import { EntidadModule } from './entidad/entidad.module';
import { EntidadiiModule } from './entidadii/entidadii.module';
import { ProfesionalesModule } from './profesionales/profesionales.module';
import { FirmasModule } from './firmas/firmas.module';
import { ConsentimientosModule } from './consentimientos/consentimientos.module';
import { DocumentoAnexoArchivoModule } from './documento-anexo-archivo/documento-anexo-archivo.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
      // exclude: ['/api*'],
      // exclude: ['/api', '/api/:rest(.*)'],
      exclude: ['/api', '/api/:rest(.*)'],
    }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'TUFF16\\MSSQLSERVER2019',
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
    AuthModule,
    ContraseñasModule,
    EntidadModule,
    EntidadiiModule,
    ProfesionalesModule,
    FirmasModule,
    ConsentimientosModule,
    DocumentoAnexoArchivoModule,
  ],

  controllers: [AppController, ConsentimientosController],
  providers: [AppService],
})
export class AppModule {}
