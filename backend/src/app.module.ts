import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicosModule } from './servicos/servicos.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/oficina'),
    ServicosModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}