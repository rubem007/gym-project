import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  bi: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  genre: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  address: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  email: string;
}
