export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailOptions {
  from: {
    email: string;
    name: string;
  };
  to: EmailRecipient[];
  subject: string;
  html: string;
  category: EmailCategory;
}

export type EmailCategory = 'welcome' | 'comment_notification' | 'connection_accepted'; 