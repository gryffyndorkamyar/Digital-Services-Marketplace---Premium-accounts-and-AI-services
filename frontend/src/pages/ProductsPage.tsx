import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Loader, Sparkles, Flame, Star } from 'lucide-react';
import { productsAPI } from '../services/api';
import QuickPurchaseModal from '../components/QuickPurchaseModal';
import { useQuickPurchase } from '../hooks/useQuickPurchase';
import { resolveMediaUrl, extractPriceValue, formatPriceLabel, isProductAvailable, getProductPrimaryImage } from '../utils/product';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description?: string;
  price?: any;
  discount_price?: any;
  final_price?: any;
  image?: string;
  rating?: number;
  tags?: string[];
  priceValue?: number | null;
  priceLabel?: string;
  isPurchasable?: boolean;
  primaryImage?: string;
  [key: string]: any;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { openQuickPurchase, quickPurchaseState } = useQuickPurchase();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [all, featured, trending] = await Promise.all([
          productsAPI.getAll<Product>(),
          productsAPI.getFeatured<Product>(),
          productsAPI.getTrending<Product>(),
        ]);
        const normalize = (list: Product[]) =>
          list.map((item) => {
            const priceValue = extractPriceValue(item);
            const primaryImage = getProductPrimaryImage(item);
            return {
              ...item,
              priceValue,
              priceLabel: formatPriceLabel(priceValue),
              isPurchasable: isProductAvailable(item),
              primaryImage,
            };
          });
        setProducts(normalize(all));
        setFeaturedProducts(normalize(featured));
        setTrendingProducts(normalize(trending));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return products;
    }

    const term = searchTerm.toLowerCase();
    return products.filter((product) =>
      product.name?.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  return (
    <div className="min-h-screen pt-16 pb-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 neon-bg">
        <div className="absolute top-0 left-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mt-8 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold neon-glow mb-3">محصولات</h1>
            <p className="text-gray-300 max-w-2xl">
              جدیدترین محصولات دیجیتال و خدمات گیمینگ با تم نارنجی-مشکی نئونی را کشف کنید.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-neonOrange w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-72 py-3 pr-10 pl-4 bg-dark-surface border border-neonOrange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonOrange focus:ring-2 focus:ring-neonOrange/30 transition-all"
                placeholder="جستجوی محصول..."
              />
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-3 bg-dark-surface border border-neonOrange/30 text-white rounded-lg hover:border-neonOrange transition-all">
              <SlidersHorizontal className="w-5 h-5 text-neonOrange" />
              فیلترها
            </button>
          </div>
        </div>

        {featuredProducts.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-neonOrange" />
              <h2 className="text-2xl font-bold text-neonOrange">محصولات ویژه</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={`featured-${product.id}`}
                  product={product}
                  onQuickBuy={() => openQuickPurchase(product)}
                />
              ))}
            </div>
          </section>
        )}

        {trendingProducts.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Flame className="w-6 h-6 text-neonOrange" />
              <h2 className="text-2xl font-bold text-neonOrange">محصولات پرطرفدار</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingProducts.map((product) => (
                <ProductCard
                  key={`trending-${product.id}`}
                  product={product}
                  onQuickBuy={() => openQuickPurchase(product)}
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-6 h-6 text-neonOrange" />
            <h2 className="text-2xl font-bold text-neonOrange">همه محصولات</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader className="w-12 h-12 text-neonOrange animate-spin" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickBuy={() => openQuickPurchase(product)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-300 py-16">
              محصولی یافت نشد.
            </div>
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

const ProductCard: React.FC<{ product: Product; onQuickBuy: () => void }> = ({ product, onQuickBuy }) => {
  const hasRating = typeof product.rating === 'number';
  const imageSrc = product.primaryImage ?? getProductPrimaryImage(product) ?? resolveMediaUrl(product.image) ?? product.image;
  const priceLabel = product.priceLabel ?? formatPriceLabel(product.priceValue ?? extractPriceValue(product));
  const isPurchasable = product.isPurchasable ?? isProductAvailable(product);

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-2xl p-6 hover:border-neonOrange transition-all hover:scale-[1.02] flex flex-col gap-4"
    >
      {imageSrc && (
        <div className="relative overflow-hidden rounded-xl bg-dark-surface h-48 flex items-center justify-center">
          <img
            src={imageSrc}
            alt={product.name}
            className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-col items-center text-center gap-3 flex-1">
        <h3 className="text-lg font-bold text-white group-hover:text-neonOrange transition-colors line-clamp-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-gray-400 text-sm line-clamp-2 min-h-[40px]">{product.description}</p>
        )}
        <span className="text-neonOrange font-bold text-lg">{priceLabel}</span>
        {hasRating && (
          <span className="flex items-center gap-1 text-yellow-400 text-sm">
            <Star className="w-4 h-4" />
            {product.rating!.toFixed(1)}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          if (!isPurchasable) {
            toast('این محصول در حال حاضر موجود نیست', { icon: 'ℹ️' });
            return;
          }
          onQuickBuy();
        }}
        disabled={!isPurchasable}
        className="mt-4 w-full py-2 border border-neonOrange/50 text-neonOrange rounded-lg hover:bg-neonOrange/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPurchasable ? 'خرید سریع' : 'ناموجود'}
      </button>
    </Link>
  );
};

export default ProductsPage;

