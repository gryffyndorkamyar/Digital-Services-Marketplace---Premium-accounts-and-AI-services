import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loader, ArrowRight, Star, Sparkles } from 'lucide-react';
import { productsAPI } from '../services/api';
import QuickPurchaseModal from '../components/QuickPurchaseModal';
import { useQuickPurchase } from '../hooks/useQuickPurchase';
import { resolveMediaUrl, extractPriceValue, formatPriceLabel, isProductAvailable } from '../utils/product';

interface ProductDetail {
  id: string;
  name: string;
  description?: string;
  short_description?: string;
  price?: any;
  discount_price?: any;
  final_price?: any;
  image?: string;
  gallery?: string[];
  rating?: number;
  tags?: Array<{ id: string; name: string }>;
  categories?: Array<{ id: string; name: string }>;
  is_featured?: boolean;
  priceValue?: number | null;
  priceLabel?: string;
  isPurchasable?: boolean;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [related, setRelated] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
        const normalizedProduct: ProductDetail = {
          ...details,
          image: resolveMediaUrl(details.image) ?? details.image,
          gallery: Array.isArray(details.gallery)
            ? details.gallery.map((img: any) => resolveMediaUrl(img) ?? img)
            : [],
          priceValue,
          priceLabel: formatPriceLabel(priceValue),
          isPurchasable: isProductAvailable(details),
        };
        const normalizedRelated = (relatedProducts || []).map((item: any) => {
          const relatedPrice = extractPriceValue(item);
          return {
            ...item,
            image: resolveMediaUrl(item.image) ?? item.image,
            priceValue: relatedPrice,
            priceLabel: formatPriceLabel(relatedPrice),
            isPurchasable: isProductAvailable(item),
          };
        });
        setProduct(normalizedProduct);
        setRelated(normalizedRelated);
      } catch (err: any) {
        console.error('Error loading product detail:', err);
        setError(err?.message || 'در بارگذاری محصول خطایی رخ داد');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const galleryImages = useMemo(() => {
    if (!product) return [] as string[];
    const images: string[] = [];
    if (product.image) images.push(product.image);
    if (Array.isArray(product.gallery)) {
      product.gallery.forEach((img) => {
        if (img && !images.includes(img)) images.push(img);
      });
    }
    return images;
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader className="w-12 h-12 text-neonOrange animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center text-gray-300 gap-6">
        <Sparkles className="w-12 h-12 text-neonOrange" />
        <p>{error || 'محصول مورد نظر یافت نشد.'}</p>
        <Link to="/products" className="neon-button px-6 py-3 rounded-lg text-white font-bold flex items-center gap-2">
          <ArrowRight className="w-4 h-4" />
          بازگشت به محصولات
        </Link>
      </div>
    );
  }

  const priceLabel = product.priceLabel ?? formatPriceLabel(product.priceValue ?? extractPriceValue(product));
  const originalPriceValue = extractPriceValue({ price: product.price });
  const originalPriceLabel = originalPriceValue !== null ? formatPriceLabel(originalPriceValue) : null;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 neon-bg">
        <div className="absolute top-24 left-[10%] w-64 h-64 bg-neonOrange/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-[15%] w-80 h-80 bg-neonOrange/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-dark-100/60 border border-neonOrange/20 rounded-3xl p-8 md:p-12 backdrop-blur-xl">
          <div className="space-y-6">
            <div className="relative">
              {galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.map((img, index) => (
                    <div
                      key={`${img}-${index}`}
                      className="aspect-square rounded-2xl overflow-hidden border border-neonOrange/20 bg-dark-100"
                    >
                      <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="aspect-square rounded-2xl flex items-center justify-center bg-dark-100 border border-neonOrange/20 text-gray-500">
                  تصویری موجود نیست
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {product.is_featured && (
                  <span className="px-3 py-1 rounded-full bg-neonOrange/10 text-neonOrange text-sm font-medium">
                    ویژه
                  </span>
                )}
                {typeof product.rating === 'number' && (
                  <span className="inline-flex items-center gap-1 text-yellow-400 text-sm">
                    <Star className="w-4 h-4" />
                    {product.rating.toFixed(1)}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{product.name}</h1>
              <p className="text-gray-300 leading-7">
                {product.description || product.short_description || 'توضیحاتی برای این محصول ثبت نشده است.'}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-dark-surface border border-neonOrange/20 rounded-2xl p-4">
              <div>
                <p className="text-sm text-gray-400">قیمت</p>
                <p className="text-2xl font-bold text-neonOrange">{priceLabel}</p>
                {product.discount_price && originalPriceLabel && (
                  <p className="text-sm text-gray-400 line-through">{originalPriceLabel}</p>
                )}
              </div>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 rounded-full text-xs bg-dark-surface border border-neonOrange/20 text-gray-300"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                className="flex-1 neon-button py-3 rounded-xl text-lg font-bold text-white disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={() => openQuickPurchase(product)}
                disabled={!product.isPurchasable}
              >
                {product.isPurchasable ? 'خرید سریع' : 'ناموجود'}
              </button>
              <Link
                to="/cart"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-neonOrange/40 rounded-xl text-white hover:bg-neonOrange/10 transition"
              >
                <ArrowRight className="w-4 h-4" />
                مشاهده سبد
              </Link>
            </div>
          </div>
        </div>

        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">محصولات مرتبط</h2>
            <Link to="/products" className="text-sm text-neonOrange flex items-center gap-1">
              مشاهده همه
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {related.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((item) => (
                <RelatedProductCard
                  key={item.id}
                  product={item}
                  onQuickBuy={() =>
                    openQuickPurchase(item)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-center py-10">محصول مرتبطی یافت نشد.</div>
          )}
        </section>
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
    </div>
  );
};

const RelatedProductCard: React.FC<{
  product: ProductDetail;
  onQuickBuy: () => void;
}> = ({ product, onQuickBuy }) => {
  const hasRating = typeof product.rating === 'number';
  const priceLabel = product.priceLabel ?? formatPriceLabel(product.priceValue ?? extractPriceValue(product));
  const imageSrc = resolveMediaUrl(product.image) ?? product.image;
  const isPurchasable = product.isPurchasable ?? isProductAvailable(product);

  return (
    <div className="group bg-dark-100/60 border border-neonOrange/20 hover:border-neonOrange/60 rounded-2xl p-5 transition-all duration-300 backdrop-blur-xl">
      <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-dark-surface">
        {imageSrc ? (
          <img src={imageSrc} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">بدون تصویر</div>
        )}
      </div>
      <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{product.name}</h3>
      <p className="text-neonOrange font-semibold mb-3">{priceLabel}</p>
      {hasRating && (
        <div className="text-yellow-400 text-sm mb-3 flex items-center gap-1">
          <Star className="w-4 h-4" />
          {product.rating?.toFixed(1)}
        </div>
      )}
      <div className="flex items-center gap-3">
        <Link
          to={`/products/${product.id}`}
          className="flex-1 text-sm text-neonOrange hover:underline"
        >
          مشاهده جزئیات
        </Link>
        <button
          type="button"
          className="px-3 py-2 bg-neonOrange/20 hover:bg-neonOrange/40 text-white rounded-lg text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={onQuickBuy}
          disabled={!isPurchasable}
        >
          {isPurchasable ? 'خرید سریع' : 'ناموجود'}
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
