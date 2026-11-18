export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  is_active: boolean;
  is_superuser?: boolean;
  created_at?: string;
}
