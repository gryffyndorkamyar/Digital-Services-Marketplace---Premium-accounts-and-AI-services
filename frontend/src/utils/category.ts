import { resolveMediaUrl } from './product';

const appendCacheBuster = (url: string, key?: any): string => {
  if (!key) return url;
  const cacheKey = typeof key === 'string' ? key : JSON.stringify(key);
  if (!cacheKey) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${encodeURIComponent(cacheKey)}`;
};

export const getCategoryImage = (category: any): string | undefined => {
  if (!category) return undefined;
  const baseKeys = [category.imageUrl, category.image_url, category.image];
  const versionKey =
    category.updated_at ||
    category.updatedAt ||
    category.modified_at ||
    category.modifiedAt ||
    category.updated;

  for (const candidate of baseKeys) {
    if (!candidate) continue;
    const resolved = resolveMediaUrl(candidate) ?? candidate;
    if (resolved) {
      const cacheKey = versionKey || `${candidate}-${Date.now()}`;
      return appendCacheBuster(resolved, cacheKey);
    }
  }

  return undefined;
};
