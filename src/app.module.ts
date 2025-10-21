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

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
      // exclude: ['/api*'], 
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
  ],

  controllers: [AppController, ConsentimientosController],
  providers: [AppService],
})
export class AppModule { }
