// src/tasks/tasks.service.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private databaseService: DatabaseService) {}

  async getAllTasks() {
    try {
      return await this.databaseService.task.findMany();
    } catch (error) {
      console.log(`\n\n Error in getAllTasks: \n `, error);
      throw new InternalServerErrorException('Error in retreieving all tasks.');
    }
  }

  async getUserTasks(userId: number) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { uid: userId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      return this.databaseService.task.findMany({ where: { uid: userId } });
    } catch (error) {
      console.log(`\n\n Error in getUserTasks: \n\n`, error);
      throw new Error('Failed to access the database');
    }
  }

  async getTaskById(id: number) {
    const task = await this.databaseService.task.findUnique({
      where: { tid: id },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async createTask(userId: number, createTaskDto: CreateTaskDto) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { uid: userId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      return this.databaseService.task.create({
        data: {
          ...createTaskDto,
          uid: userId,
        },
      });
    } catch (error) {
      console.log(`\n\n Error in createTask: \n\n`, error);
      throw new Error('Failed to access the database');
    }
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const task = await this.databaseService.task.findUnique({
        where: { tid: id },
      });
      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      return this.databaseService.task.update({
        where: { tid: id },
        data: updateTaskDto,
      });
    } catch (error) {
      console.log(`\n\n Error in updateTask: \n\n`, error);
      throw new Error('Failed to access the database');
    }
  }

  async deleteTask(id: number) {
    try {
      const task = await this.databaseService.task.findUnique({
        where: { tid: id },
      });
      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      return this.databaseService.task.delete({ where: { tid: id } });
    } catch (error) {
      console.log(`\n\n Error in deleteTask: \n\n`, error);
      throw new Error('Failed to access the database');
    }
  }
}
