export interface AccountProfile {
  name: string;
  email: string;
  plan: string;
  memberSince: string;
  devices: string;
  // Set once a real profile photo exists; the avatar shows initials until then.
  avatarUrl?: string;
}
