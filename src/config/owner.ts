export const OWNER_UID = 'qBBKffxqWAMhKJP2YrXvM3Jdvke2';

export function isOwnerUser(user: { uid?: string } | null | undefined): boolean {
  if (!user) return false;
  return user.uid === OWNER_UID;
}

