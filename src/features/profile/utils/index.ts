const FALLBACK_INITIALS = 'U';

export const getUserInitials = (name?: string): string => {
  const normalizedName = name?.trim();
  if (!normalizedName) return FALLBACK_INITIALS;

  const parts = normalizedName.split(/\s+/).filter(Boolean);
  const firstPart = parts[0];

  if (!firstPart) return FALLBACK_INITIALS;

  if (parts.length === 1) {
    return firstPart.slice(0, 2).toUpperCase();
  }

  const lastPart = parts[parts.length - 1];
  const firstInitial = firstPart.charAt(0);
  const lastInitial = lastPart?.charAt(0) ?? '';

  const initials = `${firstInitial}${lastInitial}`.toUpperCase();
  return initials || firstPart.slice(0, 2).toUpperCase() || FALLBACK_INITIALS;
};
