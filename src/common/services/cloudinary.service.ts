import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get('cloudinary.cloud_name'),
      api_key: configService.get('cloudinary.api_key'),
      api_secret: configService.get('cloudinary.api_secret'),
    });
  }

  async uploadImage(imageString: string): Promise<any> {
    return cloudinary.uploader.upload(imageString);
  }
} 