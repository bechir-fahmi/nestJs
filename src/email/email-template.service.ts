import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailTemplateService {
  createWelcomeEmailTemplate(name: string, profileUrl: string): string {
    return this.getBaseTemplate({
      title: 'Welcome to UnLinked',
      headerText: 'Welcome to UnLinked!',
      content: this.getWelcomeContent(name, profileUrl),
    });
  }

  createConnectionAcceptedTemplate(senderName: string, recipientName: string, profileUrl: string): string {
    return this.getBaseTemplate({
      title: 'Connection Request Accepted',
      headerText: 'Connection Accepted!',
      content: this.getConnectionAcceptedContent(senderName, recipientName, profileUrl),
    });
  }

  createCommentNotificationTemplate(
    recipientName: string,
    commenterName: string,
    postUrl: string,
    commentContent: string,
  ): string {
    return this.getBaseTemplate({
      title: 'New Comment on Your Post',
      headerText: 'New Comment on Your Post',
      content: this.getCommentNotificationContent(recipientName, commenterName, postUrl, commentContent),
    });
  }

  private getBaseTemplate({ title, headerText, content }: BaseTemplateProps): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #0077B5, #00A0DC); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <img src="https://img.freepik.com/premium-vector/linkedin-logo_578229-227.jpg" alt="UnLinked Logo" style="width: 150px; margin-bottom: 20px;border-radius: 10px;"/>
    <h1 style="color: white; margin: 0; font-size: 28px;">${headerText}</h1>
  </div>
  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    ${content}
    <p>Best regards,<br>The UnLinked Team</p>
  </div>
</body>
</html>`;
  }

  private getWelcomeContent(name: string, profileUrl: string): string {
    return `
    <p style="font-size: 18px; color: #0077B5;"><strong>Hello ${name},</strong></p>
    <p>We're thrilled to have you join our professional community! UnLinked is your platform to connect, learn, and grow in your career.</p>
    <div style="background-color: #f3f6f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="font-size: 16px; margin: 0;"><strong>Here's how to get started:</strong></p>
      <ul style="padding-left: 20px;">
        <li>Complete your profile</li>
        <li>Connect with colleagues and friends</li>
        <li>Join groups relevant to your interests</li>
        <li>Explore job opportunities</li>
      </ul>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${profileUrl}" style="background-color: #0077B5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">Complete Your Profile</a>
    </div>
    <p>If you have any questions or need assistance, our support team is always here to help.</p>`;
  }

  private getConnectionAcceptedContent(senderName: string, recipientName: string, profileUrl: string): string {
    return `
    <p style="font-size: 18px; color: #0077B5;"><strong>Hello ${senderName},</strong></p>
    <p>Great news! <strong>${recipientName}</strong> has accepted your connection request on UnLinked.</p>
    <div style="background-color: #f3f6f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="font-size: 16px; margin: 0;"><strong>What's next?</strong></p>
      <ul style="padding-left: 20px;">
        <li>Check out ${recipientName}'s full profile</li>
        <li>Send a message to start a conversation</li>
        <li>Explore mutual connections and interests</li>
      </ul>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${profileUrl}" style="background-color: #0077B5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">View ${recipientName}'s Profile</a>
    </div>
    <p>Expanding your professional network opens up new opportunities. Keep connecting!</p>`;
  }

  private getCommentNotificationContent(
    recipientName: string,
    commenterName: string,
    postUrl: string,
    commentContent: string,
  ): string {
    return `
    <p style="font-size: 18px; color: #0077B5;"><strong>Hello ${recipientName},</strong></p>
    <p>${commenterName} has commented on your post:</p>
    <div style="background-color: #f3f6f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="font-style: italic; margin: 0;">"${commentContent}"</p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${postUrl}" style="background-color: #0077B5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">View Comment</a>
    </div>
    <p>Stay engaged with your network by responding to comments and fostering discussions.</p>`;
  }
}

interface BaseTemplateProps {
  title: string;
  headerText: string;
  content: string;
} 