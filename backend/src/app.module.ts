import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicosModule } from './servicos/servicos.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://nicolasdshoffmann2105_db_user:nkzs2105@cluster0.h6tljvm.mongodb.net/oficina?retryWrites=true&w=majority'),
    ServicosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}