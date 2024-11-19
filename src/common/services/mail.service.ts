import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailtrapClient } from 'mailtrap';

@Injectable()
export class MailService {
  private mailtrapClient: MailtrapClient;
  private sender: { email: string; name: string };

  constructor(private configService: ConfigService) {
    this.mailtrapClient = new MailtrapClient({ token: configService.get('mailtrap.token') });
    this.sender = {
      email: configService.get('mailtrap.from.email'),
      name: configService.get('mailtrap.from.name'),
    };
  }

  async sendWelcomeEmail(email: string, name: string, profileUrl: string) {
    const recipient = [{ email }];
    await this.mailtrapClient.send({
      from: this.sender,
      to: recipient,
      subject: 'Welcome to UnLinked',
      html: this.createWelcomeEmailTemplate(name, profileUrl),
      category: 'welcome',
    });
  }

  async sendCommentNotificationEmail(
    recipientEmail: string,
    recipientName: string,
    commenterName: string,
    postUrl: string,
    commentContent: string,
  ) {
    const recipient = [{ email: recipientEmail }];
    await this.mailtrapClient.send({
      from: this.sender,
      to: recipient,
      subject: 'New Comment on Your Post',
      html: this.createCommentNotificationEmailTemplate(
        recipientName,
        commenterName,
        postUrl,
        commentContent,
      ),
      category: 'comment_notification',
    });
  }

  private createWelcomeEmailTemplate(name: string, profileUrl: string): string {
    // Reference to the original template
    return `<!DOCTYPE html>...`; // Template from emailTemplates.js
  }

  private createCommentNotificationEmailTemplate(
    recipientName: string,
    commenterName: string,
    postUrl: string,
    commentContent: string,
  ): string {
    // Reference to lines 72-99 in emailTemplates.js
    return `<!DOCTYPE html>...`;
  }
} 