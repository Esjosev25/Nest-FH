import { IsUUID } from 'class-validator';

export class AuthStatusDto {
  @IsUUID()
  id: string;
}
