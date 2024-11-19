import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Post } from '../../posts/schemas/post.schema';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  recipient: User;

  @Prop({ 
    type: String, 
    enum: ['like', 'comment', 'connection_request', 'connectionAccepted'],
    required: true 
  })
  type: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  relatedUser: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post' })
  relatedPost: Post;

  @Prop({ type: Boolean, default: false })
  read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification); 