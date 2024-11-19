import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  author: User;

  @Prop({ required: true })
  content: string;

  @Prop()
  image: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  likes: User[];

  @Prop([{
    content: String,
    user: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }])
  comments: Array<{
    content: string;
    user: User;
    createdAt: Date;
  }>;
}

export const PostSchema = SchemaFactory.createForClass(Post); 