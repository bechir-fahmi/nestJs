import { Controller, Get, Post, Put, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConnectionRequestDto, ConnectionRequestParamDto } from './dto/connection-request.dto';

@Controller('connections')
@UseGuards(JwtAuthGuard)
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Post('request/:userId')
  async sendConnectionRequest(
    @Param('userId') recipientId: string,
    @Req() req,
  ) {
    return this.connectionsService.sendConnectionRequest(req.user._id, recipientId);
  }

  @Put('accept/:requestId')
  async acceptConnectionRequest(
    @Param('requestId') requestId: string,
    @Req() req,
  ) {
    return this.connectionsService.acceptConnectionRequest(requestId, req.user._id);
  }

  @Put('reject/:requestId')
  async rejectConnectionRequest(
    @Param() params: ConnectionRequestParamDto,
    @Req() req,
  ) {
    return this.connectionsService.rejectConnectionRequest(params.requestId, req.user._id);
  }

  @Delete(':userId')
  async removeConnection(
    @Param('userId') targetUserId: string,
    @Req() req,
  ) {
    return this.connectionsService.removeConnection(req.user._id, targetUserId);
  }

  @Get('status/:userId')
  async getConnectionStatus(
    @Param('userId') targetUserId: string,
    @Req() req,
  ) {
    return this.connectionsService.getConnectionStatus(req.user._id, targetUserId);
  }

  @Get('requests')
  async getConnectionRequests(@Req() req) {
    return this.connectionsService.getConnectionRequests(req.user._id);
  }

  @Get()
  async getUserConnections(@Req() req) {
    return this.connectionsService.getUserConnections(req.user._id);
  }
}
