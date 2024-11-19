import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailtrapClient } from 'mailtrap';
import { EmailTemplateService } from '../email/services/email-template.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly mailtrapClient: MailtrapClient;
  private readonly sender: { email: string; name: string };
  private readonly clientUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly emailTemplateService: EmailTemplateService,
  ) {
    this.mailtrapClient = new MailtrapClient({
      token: this.configService.get<string>('email.mailtrapToken'),
    });
    this.sender = this.configService.get('email.from');
    this.clientUrl = this.configService.get('client.url');
  }

  async sendConnectionAcceptedEmail(
    senderEmail: string,
    senderName: string,
    recipientName: string,
    recipientUsername: string,
  ): Promise<void> {
    const profileUrl = `${this.clientUrl}/profile/${recipientUsername}`;
    const recipient = [{ email: senderEmail }];

    try {
      await this.mailtrapClient.send({
        from: this.sender,
        to: recipient,
        subject: `${recipientName} accepted your connection request`,
        html: this.emailTemplateService.createConnectionAcceptedTemplate({
          senderName,
          recipientName,
          profileUrl,
        }),
        category: 'connection_accepted',
      });
      this.logger.log(`Connection accepted email sent successfully to ${senderEmail}`);
    } catch (error) {
      this.logger.error(`Error sending connection accepted email to ${senderEmail}:`, error);
      throw error;
    }
  }

  async sendCommentNotificationEmail(
    recipientEmail: string,
    recipientName: string,
    commenterName: string,
    postId: string,
    commentContent: string,
  ): Promise<void> {
    const postUrl = `${this.clientUrl}/post/${postId}`;
    const recipient = [{ email: recipientEmail }];

    try {
      await this.mailtrapClient.send({
        from: this.sender,
        to: recipient,
        subject: 'New Comment on Your Post',
        html: this.emailTemplateService.createCommentNotificationTemplate({
          recipientName,
          commenterName,
          postUrl,
          commentContent,
        }),
        category: 'comment_notification',
      });
      this.logger.log(`Comment notification email sent successfully to ${recipientEmail}`);
    } catch (error) {
      this.logger.error(`Error sending comment notification email to ${recipientEmail}:`, error);
      throw error;
    }
  }
} 