import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConnectionRequest } from './schemas/connection-request.schema';
import { User } from '../users/schemas/user.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../email/services/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectModel(ConnectionRequest.name) private connectionRequestModel: Model<ConnectionRequest>,
    @InjectModel(User.name) private userModel: Model<User>,
    private notificationsService: NotificationsService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async rejectConnectionRequest(requestId: string, userId: string) {
    const request = await this.connectionRequestModel.findById(requestId);
    
    if (!request) {
      throw new NotFoundException('Connection request not found');
    }

    if (request.recipient.toString() !== userId) {
      throw new ForbiddenException('Not authorized to reject this request');
    }

    if (request.status !== 'pending') {
      throw new BadRequestException('This request has already been processed');
    }

    request.status = 'rejected';
    await request.save();

    return { message: 'Connection request rejected' };
  }

  async getConnectionRequests(userId: string) {
    return this.connectionRequestModel
      .find({ recipient: userId, status: 'pending' })
      .populate('sender', 'name username profilePicture headline connections');
  }

  async getUserConnections(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('connections', 'name username profilePicture headline connections');
    
    return user.connections;
  }

  async sendConnectionRequest(senderId: string, recipientId: string) {
    if (senderId === recipientId) {
      throw new BadRequestException("You can't send a request to yourself");
    }

    const sender = await this.userModel.findById(senderId);
    if (sender.connections.includes(recipientId)) {
      throw new BadRequestException('You are already connected');
    }

    const existingRequest = await this.connectionRequestModel.findOne({
      sender: senderId,
      recipient: recipientId,
      status: 'pending',
    });

    if (existingRequest) {
      throw new BadRequestException('Connection request already sent');
    }

    const request = await this.connectionRequestModel.create({
      sender: senderId,
      recipient: recipientId,
    });

    await this.notificationsService.createNotification({
      recipient: recipientId,
      type: 'connection_request',
      sender: senderId,
    });

    return { message: 'Connection request sent successfully' };
  }

  async getConnectionStatus(currentUserId: string, targetUserId: string) {
    const currentUser = await this.userModel.findById(currentUserId);
    
    if (currentUser.connections.includes(targetUserId)) {
      return { status: 'connected' };
    }

    const pendingRequest = await this.connectionRequestModel.findOne({
      $or: [
        { sender: currentUserId, recipient: targetUserId },
        { sender: targetUserId, recipient: currentUserId },
      ],
      status: 'pending',
    });

    if (pendingRequest) {
      if (pendingRequest.sender.toString() === currentUserId) {
        return { status: 'pending' };
      } else {
        return { status: 'received', requestId: pendingRequest._id };
      }
    }

    return { status: 'not_connected' };
  }

  async acceptConnectionRequest(requestId: string, userId: string) {
    const request = await this.connectionRequestModel.findById(requestId)
      .populate('sender', 'name email username')
      .populate('recipient', 'name username');

    if (!request) {
      throw new NotFoundException('Connection request not found');
    }

    if (request.recipient._id.toString() !== userId) {
      throw new ForbiddenException('Not authorized to accept this request');
    }

    if (request.status !== 'pending') {
      throw new BadRequestException('This request has already been processed');
    }

    request.status = 'accepted';
    await request.save();

    // Update both users' connections
    await this.userModel.findByIdAndUpdate(request.sender._id, {
      $addToSet: { connections: userId }
    });
    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { connections: request.sender._id }
    });

    // Create notification
    await this.notificationsService.createNotification({
      recipient: request.sender._id,
      type: 'connectionAccepted',
      relatedUser: userId,
    });

    // Send email
    const profileUrl = `${this.configService.get('client.url')}/profile/${request.recipient.username}`;
    
    try {
      await this.emailService.sendConnectionAcceptedEmail(
        request.sender.email,
        request.sender.name,
        request.recipient.name,
        profileUrl
      );
    } catch (error) {
      console.error('Error sending connection accepted email:', error);
    }

    return { message: 'Connection accepted successfully' };
  }

  async removeConnection(currentUserId: string, targetUserId: string) {
    await this.userModel.findByIdAndUpdate(currentUserId, {
      $pull: { connections: targetUserId }
    });
    await this.userModel.findByIdAndUpdate(targetUserId, {
      $pull: { connections: currentUserId }
    });

    return { message: 'Connection removed successfully' };
  }
}
