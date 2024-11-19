export interface EmailConfig {
  mailtrapToken: string;
  from: {
    email: string;
    name: string;
  };
  clientUrl: string;
}
