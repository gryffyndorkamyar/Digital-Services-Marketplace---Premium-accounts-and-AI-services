import { API_BASE_URL } from '../services/api';
import { resolveMediaUrl } from './product';

const API_ORIGIN = API_BASE_URL.replace(/\/?api\/?$/, '');

export const getCategoryImage = (category: any): string | undefined => {
  if (!category) return undefined;
  if (category.imageUrl) {
    return resolveMediaUrl(category.imageUrl) ?? category.imageUrl;
  }
  if (category.image_url) {
    return resolveMediaUrl(category.image_url) ?? category.image_url;
  }
  if (category.image) {
    return resolveMediaUrl(category.image) ?? category.image;
  }
  return undefined;
};
