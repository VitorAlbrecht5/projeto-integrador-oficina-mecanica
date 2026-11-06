import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { Admin, AdminDocument } from './schemas/admin.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, senha } = loginDto;

    // Busca o admin real no banco de dados
    const admin = await this.adminModel.findOne({ email });

    if (!admin || !(await bcrypt.compare(senha, admin.senha))) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const payload = { sub: admin._id, email: admin.email };

    return {
      mensagem: 'Login realizado com sucesso!',
      access_token: this.jwtService.sign(payload),
    };
  }
}