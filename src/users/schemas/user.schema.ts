import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: '' })
  profilePicture: string;

  @Prop({ default: '' })
  bannerImg: string;

  @Prop({ default: 'Linkedin User' })
  headline: string;

  @Prop({ default: 'Earth' })
  location: string;

  @Prop({ default: '' })
  about: string;

  @Prop([String])
  skills: string[];

  @Prop([{
    title: String,
    company: String,
    startDate: Date,
    endDate: Date,
    description: String,
  }])
  experience: Array<{
    title: string;
    company: string;
    startDate: Date;
    endDate: Date;
    description: string;
  }>;

  @Prop([{
    school: String,
    fieldOfStudy: String,
    startYear: Number,
    endYear: Number,
  }])
  education: Array<{
    school: string;
    fieldOfStudy: string;
    startYear: number;
    endYear: number;
  }>;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  connections: User[];
}

export const UserSchema = SchemaFactory.createForClass(User); 