import { API_BASE_URL } from '../services/api';

const API_ORIGIN = API_BASE_URL.replace(/\/?api\/?$/, '');

export const resolveMediaUrl = (path?: string | null): string | undefined => {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith('//')) return `http:${path}`;
  let normalized = path.startsWith('/') ? path : `/${path}`;
  if (!normalized.startsWith('/media/')) {
    normalized = `/media${normalized}`.replace(/\/{2,}/g, '/');
  }
  return `${API_ORIGIN}${normalized}`;
};

const priceCandidateKeys = [
  'discount_price',
  'final_price',
  'price',
  'current_price',
  'sale_price',
  'base_price',
  'min_price',
];

export const extractPriceValue = (source: any): number | null => {
  if (!source) return null;
  for (const key of priceCandidateKeys) {
    if (source[key] === undefined || source[key] === null || source[key] === '') continue;
    const value = source[key];
    const numeric = typeof value === 'number' ? value : Number.parseFloat(String(value));
    if (Number.isFinite(numeric)) {
      return numeric;
    }
  }

  if (source.default_variant) {
    const nested = extractPriceValue(source.default_variant);
    if (nested !== null) return nested;
  }

  if (Array.isArray(source.variants)) {
    for (const variant of source.variants) {
      const nested = extractPriceValue(variant);
      if (nested !== null) return nested;
    }
  }
  return null;
};

export const formatPriceLabel = (value: number | null | undefined): string => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value.toLocaleString('fa-IR')} تومان`;
  }
  return 'قیمت نامشخص';
};

export const isProductAvailable = (product: any): boolean => {
  if (!product) return false;
  if (product.is_active === false) return false;
  if (product.is_available !== undefined) return Boolean(product.is_available);
  if (product.available !== undefined) return Boolean(product.available);
  if (product.can_purchase !== undefined) return Boolean(product.can_purchase);
  if (product.status) {
    const status = String(product.status).toLowerCase();
    if (status !== 'active') return false;
  }
  const stockFields = ['stock_quantity', 'stock', 'inventory', 'remaining_stock'];
  for (const key of stockFields) {
    if (product[key] !== undefined) {
      const numeric = Number(product[key]);
      if (Number.isFinite(numeric) && numeric <= 0) return false;
    }
  }
  if (product.default_variant) {
    const variant = product.default_variant;
    if (variant.is_available === false) return false;
    for (const key of stockFields) {
      if (variant[key] !== undefined) {
        const numeric = Number(variant[key]);
        if (Number.isFinite(numeric) && numeric <= 0) return false;
      }
    }
  }
  return extractPriceValue(product) !== null;
};

const imageCandidateKeys = ['main_image_url', 'product_image', 'image_url', 'image', 'main_image', 'thumbnail'];

export const extractImageUrl = (source: any): string | undefined => {
  if (!source) return undefined;
  if (typeof source === 'string') {
    return resolveMediaUrl(source) ?? source;
  }
  if (source?.image_url) {
    return resolveMediaUrl(source.image_url) ?? source.image_url;
  }
  if (source?.image) {
    return resolveMediaUrl(source.image) ?? source.image;
  }
  return undefined;
};

export const getProductPrimaryImage = (product: any): string | undefined => {
  if (!product) return undefined;
  for (const key of imageCandidateKeys) {
    if (product[key]) {
      const url = extractImageUrl(product[key]);
      if (url) return url;
    }
  }
  if (Array.isArray(product.images)) {
    for (const image of product.images) {
      const url = extractImageUrl(image);
      if (url) return url;
    }
  }
  return undefined;
};

export const getProductGalleryImages = (product: any): string[] => {
  const images: string[] = [];
  const addImage = (value: any) => {
    const url = extractImageUrl(value);
    if (url && !images.includes(url)) {
      images.push(url);
    }
  };

  if (!product) return images;

  for (const key of ['gallery', 'images']) {
    const value = product[key];
    if (Array.isArray(value)) {
      value.forEach((item) => addImage(item));
    }
  }

  const primary = getProductPrimaryImage(product);
  if (primary && !images.includes(primary)) {
    images.unshift(primary);
  }

  return images;
};

export const buildQuickPurchasePayload = (product: any) => {
  const price = extractPriceValue(product);
  const image = getProductPrimaryImage(product);
  const variantId = product?.default_variant?.id || product?.default_variant_id || null;
  const priceLabel = formatPriceLabel(price);

  return {
    id: product?.id,
    name: product?.name,
    price,
    priceLabel,
    description: product?.description || product?.short_description,
    image,
    variantId,
    raw: product,
  };
};
