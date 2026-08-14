import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { matchArchiveFigure } from '../../brand/ovyra';
import {
  resolveMediaUrl,
  extractPriceValue,
  formatPriceLabel,
  isProductAvailable,
  getProductPrimaryImage,
} from '../../utils/product';

export interface OvyraProduct {
  id: string;
  name: string;
  description?: string;
  price?: unknown;
  discount_price?: unknown;
  final_price?: unknown;
  image?: string;
  rating?: number;
  priceValue?: number | null;
  priceLabel?: string;
  isPurchasable?: boolean;
  primaryImage?: string;
  [key: string]: unknown;
}

interface OvyraProductCardProps {
  product: OvyraProduct;
  onQuickBuy?: () => void;
  compact?: boolean;
}

const OvyraProductCard: React.FC<OvyraProductCardProps> = ({ product, onQuickBuy, compact }) => {
  const figure = matchArchiveFigure(product.name);
  const imageSrc =
    product.primaryImage ??
    getProductPrimaryImage(product) ??
    resolveMediaUrl(product.image) ??
    product.image;
  const priceLabel = product.priceLabel ?? formatPriceLabel(product.priceValue ?? extractPriceValue(product));
  const isPurchasable = product.isPurchasable ?? isProductAvailable(product);
  const accent = figure?.accent ?? '#9d4edd';

  return (
    <article
      className="ovyra-product-card group flex flex-col overflow-hidden"
      style={{ ['--card-accent' as string]: accent }}
    >
      <Link to={`/products/${product.id}`} className="relative block overflow-hidden">
        <div className={`relative bg-ovyra-ink ${compact ? 'h-40' : 'h-52'}`}>
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product.name}
              className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <img
              src="/brand/archive-01-characters.png"
              alt=""
              className="h-full w-full object-cover object-top opacity-35"
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ovyra-void via-transparent to-transparent" />
          {figure && (
            <span
              className="absolute left-3 top-3 font-display text-[10px] tracking-[0.35em]"
              style={{ color: accent }}
            >
              {figure.code}
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <Link to={`/products/${product.id}`} className="space-y-1">
          <h3 className="line-clamp-1 text-base font-semibold text-white transition group-hover:text-ovyra-gold">
            {figure?.nameFa ?? product.name}
          </h3>
          {figure ? (
            <p className="font-display text-[10px] tracking-[0.22em] text-ovyra-mist/50">{figure.name}</p>
          ) : (
            product.description && (
              <p className="line-clamp-2 text-sm leading-6 text-ovyra-mist/60">{product.description}</p>
            )
          )}
        </Link>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <p className="font-display text-lg text-ovyra-gold">{priceLabel}</p>
            {typeof product.rating === 'number' && (
              <p className="mt-1 flex items-center gap-1 text-xs text-ovyra-mist/55">
                <Star className="h-3.5 w-3.5 text-ovyra-gold" />
                {product.rating.toFixed(1)}
              </p>
            )}
          </div>
          {onQuickBuy && (
            <button
              type="button"
              onClick={onQuickBuy}
              disabled={!isPurchasable}
              className="ovyra-btn-ghost !px-4 !py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isPurchasable ? 'Archive Now' : 'ناموجود'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default OvyraProductCard;
