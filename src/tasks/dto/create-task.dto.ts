// src/tasks/dto/create-task.dto.ts
import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsString,
  isNotEmpty,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  detail: string;
}
