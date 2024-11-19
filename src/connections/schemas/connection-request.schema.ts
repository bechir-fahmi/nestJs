import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

@Schema({ timestamps: true })
export class ConnectionRequest extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  sender: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  recipient: User;

  @Prop({ 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  })
  status: string;
}

export const ConnectionRequestSchema = SchemaFactory.createForClass(ConnectionRequest); 