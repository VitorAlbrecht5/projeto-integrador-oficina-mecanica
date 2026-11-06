import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { JwtModuleOptions } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { APP_GUARD } from '@nestjs/core';
import { PerfisGuard } from './guards/perfis.guard';

@Module({
  imports: [
    UsuariosModule,
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const secret = config.get<string>('JWT_SECRET');

        if (!secret || secret.length < 32) {
          throw new Error(
            'Defina JWT_SECRET no .env com pelo menos 32 caracteres.',
          );
        }

        return {
          secret,
          signOptions: { expiresIn: '8h' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthGuard,
    PerfisGuard,
    {
      provide: APP_GUARD,
      useExisting: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useExisting: PerfisGuard,
    },
  ],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
