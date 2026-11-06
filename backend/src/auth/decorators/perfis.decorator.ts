import { SetMetadata } from '@nestjs/common';
import type { Perfil } from '../../usuarios/schemas/usuario.schema';

export const PERFIS = 'perfis';

export const Perfis = (...perfis: Perfil[]) => SetMetadata(PERFIS, perfis);
