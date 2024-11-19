import { Controller, Get, Put, Param, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('suggested')
  getSuggestedConnections(@Req() req) {
    return this.usersService.getSuggestedConnections(req.user);
  }

  @Get('profile/:username')
  getPublicProfile(@Param('username') username: string) {
    return this.usersService.getPublicProfile(username);
  }

  @Put('profile')
  updateProfile(@Body() updateData: any, @Req() req) {
    return this.usersService.updateProfile(req.user._id, updateData);
  }
}
