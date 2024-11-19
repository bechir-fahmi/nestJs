import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { EmailTemplateService } from './services/email-template.service';
import emailConfig from '../email/config/email.config';

@Module({
  imports: [ConfigModule.forFeature(emailConfig)],
  providers: [MailService, EmailTemplateService],
  exports: [MailService],
})
export class MailModule {} 