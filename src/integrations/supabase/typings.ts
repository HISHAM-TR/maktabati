
import { Database } from './types';

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type UserRoleRow = Database['public']['Tables']['user_roles']['Row'];
export type LibraryRow = Database['public']['Tables']['libraries']['Row'];
export type BookRow = Database['public']['Tables']['books']['Row'];
export type SiteSettingsRow = Database['public']['Tables']['site_settings']['Row'];
export type SocialLinkRow = Database['public']['Tables']['social_links']['Row'];
export type TicketRow = Database['public']['Tables']['tickets']['Row'];
export type TicketResponseRow = Database['public']['Tables']['ticket_responses']['Row'];

export type UserRole = "owner" | "admin" | "moderator" | "user";
