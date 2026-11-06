import { SetMetadata } from '@nestjs/common';

export const PUBLICO = 'rotaPublica';

export const Publico = () => SetMetadata(PUBLICO, true);
