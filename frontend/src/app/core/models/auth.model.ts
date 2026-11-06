export interface LoginDto {
  email: string;
  senha: string;
}

export interface AuthResponse {
  mensagem: string;
  access_token: string;
}