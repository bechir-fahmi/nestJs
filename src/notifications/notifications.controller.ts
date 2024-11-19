import { Controller, Get, Put, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getUserNotifications(@Req() req) {
    return this.notificationsService.getUserNotifications(req.user._id);
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req) {
    return this.notificationsService.markAsRead(id, req.user._id);
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string, @Req() req) {
    await this.notificationsService.deleteNotification(id, req.user._id);
    return { message: 'Notification deleted successfully' };
  }
}
