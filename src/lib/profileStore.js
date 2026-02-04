let cachedProfile = null;

export function getProfileCache() {
  return cachedProfile;
}

export function setProfileCache(profile) {
  cachedProfile = profile;
}
