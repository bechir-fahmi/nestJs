import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async createNotification(
    recipientId: Types.ObjectId,
    type: string,
    relatedUserId: Types.ObjectId,
    relatedPostId?: Types.ObjectId,
  ): Promise<Notification> {
    try {
      const notification = new this.notificationModel({
        recipient: recipientId,
        type,
        relatedUser: relatedUserId,
        ...(relatedPostId && { relatedPost: relatedPostId }),
      });

      return await notification.save();
    } catch (error) {
      this.logger.error('Error creating notification:', error);
      throw error;
    }
  }
} 