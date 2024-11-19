import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  recipient: Types.ObjectId;

  @Prop({ required: true, enum: ['comment', 'like', 'connection'] })
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  relatedUser: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post' })
  relatedPost?: Types.ObjectId;

  @Prop({ default: false })
  read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification); 