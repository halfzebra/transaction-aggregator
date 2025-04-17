import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of all user UUIDs' })
  @ApiResponse({
    status: 200,
    description: 'List of user UUIDs retrieved successfully',
  })
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':uuid/report')
  @ApiOperation({ summary: 'Get transaction report for a specific user' })
  @ApiParam({ name: 'uuid', description: 'User UUID' })
  @ApiResponse({
    status: 200,
    description: 'User transaction report retrieved successfully',
  })
  async getUserReport(@Param('uuid') uuid: string) {
    return this.usersService.getUserReport(uuid);
  }
}