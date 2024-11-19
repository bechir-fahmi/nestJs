import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailtrapClient } from 'mailtrap';
import { EmailTemplateService } from './email-template.service';
import { EmailOptions } from '../interfaces/email.interface';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly mailtrapClient: MailtrapClient;
  private readonly sender: { email: string; name: string };

  constructor(
    private readonly configService: ConfigService,
    private readonly emailTemplateService: EmailTemplateService,
  ) {
    this.mailtrapClient = new MailtrapClient({
      token: this.configService.get<string>('email.mailtrapToken'),
    });
    this.sender = this.configService.get('email.from');
  }

  private async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.mailtrapClient.send(options);
      this.logger.log(`Email sent successfully to ${options.to[0].email}`);
    } catch (error) {
      this.logger.error(`Error sending email to ${options.to[0].email}:`, error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, name: string, username: string): Promise<void> {
    const profileUrl = `${this.configService.get('email.clientUrl')}/profile/${username}`;
    
    await this.sendEmail({
      from: this.sender,
      to: [{ email }],
      subject: 'Welcome to UnLinked',
      html: this.emailTemplateService.createWelcomeEmailTemplate({ name, profileUrl }),
      category: 'welcome',
    });
  }

  async sendCommentNotificationEmail(
    recipientEmail: string,
    recipientName: string,
    commenterName: string,
    postId: string,
    commentContent: string,
  ): Promise<void> {
    const postUrl = `${this.configService.get('email.clientUrl')}/posts/${postId}`;
    
    await this.sendEmail({
      from: this.sender,
      to: [{ email: recipientEmail }],
      subject: 'New Comment on Your Post',
      html: this.emailTemplateService.createCommentNotificationTemplate({
        recipientName,
        commenterName,
        postUrl,
        commentContent,
      }),
      category: 'comment_notification',
    });
  }

  async sendConnectionAcceptedEmail(
    senderEmail: string,
    senderName: string,
    recipientName: string,
    recipientUsername: string,
  ): Promise<void> {
    const profileUrl = `${this.configService.get('email.clientUrl')}/profile/${recipientUsername}`;
    
    await this.sendEmail({
      from: this.sender,
      to: [{ email: senderEmail }],
      subject: `${recipientName} accepted your connection request`,
      html: this.emailTemplateService.createConnectionAcceptedTemplate({
        senderName,
        recipientName,
        profileUrl,
      }),
      category: 'connection_accepted',
    });
  }
} 