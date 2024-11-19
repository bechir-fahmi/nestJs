import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CloudinaryService } from '../common/services/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async getSuggestedConnections(currentUser: any) {
    const user = await this.userModel.findById(currentUser._id).select('connections');
    
    return this.userModel.find({
      _id: {
        $ne: currentUser._id,
        $nin: user.connections,
      },
    })
      .select('name username profilePicture headline')
      .limit(3);
  }

  async getPublicProfile(username: string) {
    const user = await this.userModel.findOne({ username }).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, updateData: any) {
    const allowedFields = [
      'name', 'username', 'headline', 'about', 'location',
      'profilePicture', 'bannerImg', 'skills', 'experience', 'education'
    ];

    const updatedData = {};
    for (const field of allowedFields) {
      if (updateData[field]) {
        updatedData[field] = updateData[field];
      }
    }

    if (updateData.profilePicture) {
      const result = await this.cloudinaryService.uploadImage(updateData.profilePicture);
      updatedData['profilePicture'] = result.secure_url;
    }

    if (updateData.bannerImg) {
      const result = await this.cloudinaryService.uploadImage(updateData.bannerImg);
      updatedData['bannerImg'] = result.secure_url;
    }

    return this.userModel
      .findByIdAndUpdate(userId, { $set: updatedData }, { new: true })
      .select('-password');
  }
}
