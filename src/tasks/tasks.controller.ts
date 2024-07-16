import {
  Controller,
  Get,
  UseGuards,
  Request,
  Param,
  NotFoundException,
  Req,
  Post,
  Bind,
  Body,
  ValidationPipe,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotFoundError } from 'rxjs';
import { DatabaseService } from 'src/database/database.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { validate } from 'class-validator';
import { TasksService } from './tasks.service';
import { UserService } from 'src/user/user.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly tasksService: TasksService,
  ) {}

  // TODO: Technically shouldn't be accessible by anyone
  @UseGuards(JwtAuthGuard)
  @Get()
  async getTasks() {
    return this.tasksService.getAllTasks();
  }

  // Only accessible by the task author
  @UseGuards(JwtAuthGuard)
  @Get('/user')
  async getAllUserTasks(@Request() req: any) {
    const { userId, username } = req.user;
    console.log('In getAllUserTasks, uid is: ', userId, username);
    return await this.tasksService.getUserTasks(userId);
  }

  // Only accessible by the task author
  @UseGuards(JwtAuthGuard)
  @Get('/user/:taskId')
  getTaskById(@Request() req: any, @Param('taskId') taskId: string) {
    const { userId, username } = req.user;
    return this.tasksService.getTaskById(parseInt(taskId));
  }

  // Only accessible by task author
  // Hoping that having both Body and Request will also validate the @Body via the DTO
  @UseGuards(JwtAuthGuard)
  @Post('/user/create')
  @Bind(Request())
  createTask(
    @Request() req: any,
    @Body(new ValidationPipe()) createTaskDto: CreateTaskDto,
  ) {
    const { userId, username } = req.user;
    return this.tasksService.createTask(userId, createTaskDto);
  }
}
