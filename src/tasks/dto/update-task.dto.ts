// src/tasks/dto/update-task.dto.ts
import { IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';
import { isBooleanObject } from 'util/types';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  detail?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
