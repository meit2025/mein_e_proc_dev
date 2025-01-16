import { boolean } from 'zod';

export interface Notification {
  id: number;
  message: string;
  user_id: number;
  url_redirect: string;
  is_read: boolean;
  created_at: string;
}
