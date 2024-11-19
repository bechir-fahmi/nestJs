import { Module } from '@nestjs/common';
import { CloudinaryService } from './services/cloudinary/cloudinary.service';
import { MailtrapService } from './services/mailtrap/mailtrap.service';

@Module({
  providers: [CloudinaryService, MailtrapService]
})
export class CommonModule {}
