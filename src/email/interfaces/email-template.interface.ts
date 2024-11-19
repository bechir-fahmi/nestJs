export interface BaseEmailTemplate {
  title: string;
  headerText: string;
  content: string;
}

export interface WelcomeEmailProps {
  name: string;
  profileUrl: string;
}

export interface ConnectionAcceptedEmailProps {
  senderName: string;
  recipientName: string;
  profileUrl: string;
}

export interface CommentNotificationEmailProps {
  recipientName: string;
  commenterName: string;
  postUrl: string;
  commentContent: string;
} 