import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loader, ArrowRight, Star } from 'lucide-react';
import { productsAPI } from '../services/api';
import QuickPurchaseModal from '../components/QuickPurchaseModal';
import { useQuickPurchase } from '../hooks/useQuickPurchase';
import {
  resolveMediaUrl,
  extractPriceValue,
  formatPriceLabel,
  isProductAvailable,
  getProductPrimaryImage,
  getProductGalleryImages,
} from '../utils/product';
import { BOX_CONTENTS, matchArchiveFigure } from '../brand/ovyra';
import OvyraPageShell from '../components/ovyra/OvyraPageShell';
import OvyraProductCard, { OvyraProduct } from '../components/ovyra/OvyraProductCard';

interface ProductDetail extends OvyraProduct {
  short_description?: string;
  gallery?: string[];
  tags?: Array<{ id: string; name: string }>;
  categories?: Array<{ id: string; name: string }>;
  is_featured?: boolean;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [related, setRelated] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { openQuickPurchase, quickPurchaseState } = useQuickPurchase();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const [details, relatedProducts] = await Promise.all([
          productsAPI.getById(id),
          productsAPI.getRelated(id),
        ]);
        const priceValue = extractPriceValue(details);
        const primaryImage = getProductPrimaryImage(details);
        const normalizedProduct: ProductDetail = {
          ...details,
          image: primaryImage,
          gallery: getProductGalleryImages(details),
          priceValue,
          priceLabel: formatPriceLabel(priceValue),
          isPurchasable: isProductAvailable(details),
        };
        const normalizedRelated = (relatedProducts || []).map((item: ProductDetail) => {
          const relatedPrice = extractPriceValue(item);
          const primaryRelatedImage = getProductPrimaryImage(item);
          return {
            ...item,
            image: primaryRelatedImage,
            priceValue: relatedPrice,
            priceLabel: formatPriceLabel(relatedPrice),
            isPurchasable: isProductAvailable(item),
          };
        });
        setProduct(normalizedProduct);
        setRelated(normalizedRelated);
      } catch (err: unknown) {
        console.error('Error loading product detail:', err);
        const message = err instanceof Error ? err.message : 'در بارگذاری محصول خطایی رخ داد';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const galleryImages = useMemo(() => getProductGalleryImages(product), [product]);
  const figure = matchArchiveFigure(product?.name);

  if (loading) {
    return (
      <OvyraPageShell glow={false}>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader className="h-12 w-12 animate-spin text-ovyra-gold" />
        </div>
      </OvyraPageShell>
    );
  }

  if (error || !product) {
    return (
      <OvyraPageShell>
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-5 py-24 text-center">
          <p className="text-ovyra-mist/75">{error || 'شخصیت مورد نظر یافت نشد.'}</p>
          <Link to="/products" className="ovyra-btn-neon inline-flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            بازگشت به فروشگاه
          </Link>
        </div>
      </OvyraPageShell>
    );
  }

  const priceLabel = product.priceLabel ?? formatPriceLabel(product.priceValue ?? extractPriceValue(product));
  const originalPriceValue = extractPriceValue({ price: product.price });
  const originalPriceLabel = originalPriceValue !== null ? formatPriceLabel(originalPriceValue) : null;
  const heroImage =
    galleryImages[0] ?? product.image ?? getProductPrimaryImage(product) ?? '/brand/archive-01-characters.png';

  return (
    <OvyraPageShell>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-4">
            <div className="ovyra-holo-frame relative overflow-hidden">
              <img src={heroImage} alt={product.name} className="w-full object-cover" />
              <div className="ovyra-sheen pointer-events-none absolute inset-0" />
            </div>
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {galleryImages.slice(1, 5).map((img, index) => (
                  <div key={`${img}-${index}`} className="aspect-square overflow-hidden border border-white/10 bg-ovyra-ink">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {figure && (
              <p className="font-display text-xs tracking-[0.4em]" style={{ color: figure.accent }}>
                ARCHIVE {figure.code} · {figure.name}
              </p>
            )}
            <h1 className="font-display text-3xl text-white md:text-4xl">
              {figure?.nameFa ?? product.name}
            </h1>
            {figure && (
              <p className="font-lore text-lg italic text-ovyra-mist/75">{figure.tagline}</p>
            )}
            <p className="leading-8 text-ovyra-mist/75">
              {product.description || product.short_description || 'توضیحات این شخصیت به‌زودی تکمیل می‌شود.'}
            </p>

            <div className="ovyra-neon-panel flex items-center gap-4 p-5">
              <div>
                <p className="text-xs tracking-wide text-ovyra-mist/50">قیمت</p>
                <p className="font-display text-2xl text-ovyra-gold">{priceLabel}</p>
                {Boolean(product.discount_price) && originalPriceLabel ? (
                  <p className="text-sm text-ovyra-mist/45 line-through">{originalPriceLabel}</p>
                ) : null}
              </div>
              {typeof product.rating === 'number' && (
                <span className="mr-auto inline-flex items-center gap-1 text-sm text-ovyra-gold">
                  <Star className="h-4 w-4" />
                  {product.rating.toFixed(1)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {BOX_CONTENTS.map((item) => (
                <div key={item.title} className="border border-white/8 bg-black/30 px-3 py-3 text-sm">
                  <span className="font-display text-[10px] tracking-[0.2em] text-ovyra-gold">{item.title}</span>
                  <p className="font-fa-display mt-0.5 text-xs text-white/80">{item.titleFa}</p>
                  <p className="font-fa mt-1 text-xs leading-6 text-ovyra-mist/60">{item.desc}</p>
                </div>
              ))}
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs text-ovyra-mist/70"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="ovyra-btn-neon flex-1 justify-center disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => openQuickPurchase(product)}
                disabled={!product.isPurchasable}
              >
                {product.isPurchasable ? 'افزودن به سبد' : 'ناموجود'}
              </button>
              <Link to="/cart" className="ovyra-btn-ghost flex items-center justify-center gap-2">
                <ArrowRight className="h-4 w-4" />
                سبد خرید
              </Link>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20 border-t border-white/10 pt-16">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-display text-2xl text-white">شخصیت‌های مرتبط</h2>
              <Link to="/products" className="text-sm text-ovyra-gold hover:underline">
                همه آرشیو
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <OvyraProductCard
                  key={item.id}
                  product={item}
                  onQuickBuy={() => openQuickPurchase(item)}
                  compact
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {quickPurchaseState.product && (
        <QuickPurchaseModal
          product={quickPurchaseState.product}
          quantity={quickPurchaseState.quantity}
          onQuantityChange={(value) => quickPurchaseState.setQuantity(value)}
          onClose={quickPurchaseState.close}
          onConfirm={quickPurchaseState.confirm}
          loading={quickPurchaseState.loading}
        />
      )}
    </OvyraPageShell>
  );
};

export default ProductDetailPage;
