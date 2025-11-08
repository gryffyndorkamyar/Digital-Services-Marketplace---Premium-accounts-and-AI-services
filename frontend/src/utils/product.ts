import { API_BASE_URL } from '../services/api';

const API_ORIGIN = API_BASE_URL.replace(/\/?api\/?$/, '');

export const resolveMediaUrl = (path?: string | null): string | undefined => {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith('//')) return `http:${path}`;
  const normalized = path.startsWith('/') ? path : `/${path}`;
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
  if (product.is_available !== undefined) return Boolean(product.is_available);
  if (product.available !== undefined) return Boolean(product.available);
  if (product.can_purchase !== undefined) return Boolean(product.can_purchase);
  if (product.status) {
    const status = String(product.status).toLowerCase();
    if (['draft', 'inactive', 'disabled', 'archived'].includes(status)) return false;
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

export const buildQuickPurchasePayload = (product: any) => {
  const price = extractPriceValue(product);
  const image = resolveMediaUrl(product?.image);
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
