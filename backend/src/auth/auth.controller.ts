import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Publico } from './decorators/publico.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Publico()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const resultado = await this.authService.login(dto.email, dto.senha);

    return {
      mensagem: 'Login realizado com sucesso!',
      access_token: resultado.accessToken,
      usuario: resultado.usuario,
    };
  }
}
