import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Loader, Sparkles, Flame, Star, Minus, Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { productsAPI, cartAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  image?: string;
  rating?: number;
  tags?: string[];
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  const { isAuthenticated, showAuthModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [all, featured, trending] = await Promise.all([
          productsAPI.getAll<Product>(),
          productsAPI.getFeatured<Product>(),
          productsAPI.getTrending<Product>(),
        ]);
        setProducts(all);
        setFeaturedProducts(featured);
        setTrendingProducts(trending);
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

  const openQuickPurchase = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleQuickBuy = (product: Product) => {
    if (!isAuthenticated) {
      toast('برای خرید ابتدا وارد حساب شوید', { icon: '⚠️' });
      showAuthModal({
        onSuccess: () => openQuickPurchase(product),
      });
      return;
    }
    openQuickPurchase(product);
  };

  const ensureCart = async () => {
    try {
      const active = await cartAPI.getActive();
      if (active?.id) {
        return active;
      }
    } catch (error) {
      // در صورت نبود سبد فعال به مرحله بعد می‌رویم
    }
    return cartAPI.create();
  };

  const handlePurchase = async () => {
    if (!selectedProduct) return;
    try {
      setPurchaseLoading(true);
      const cart = await ensureCart();
      if (!cart?.id) {
        throw new Error('عدم توانایی در ایجاد سبد خرید');
      }
      await cartAPI.addItem(cart.id, {
        product_id: selectedProduct.id,
        quantity,
      });
      toast.success('محصول به سبد خرید اضافه شد');
      setSelectedProduct(null);
      navigate('/cart');
    } catch (error: any) {
      console.error('Quick purchase error:', error);
      toast.error(error?.message || 'در خرید محصول خطایی رخ داد');
    } finally {
      setPurchaseLoading(false);
    }
  };

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
                  onQuickBuy={() => handleQuickBuy(product)}
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
                  onQuickBuy={() => handleQuickBuy(product)}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickBuy={() => handleQuickBuy(product)}
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

      {selectedProduct && (
        <QuickPurchaseModal
          product={selectedProduct}
          quantity={quantity}
          onQuantityChange={setQuantity}
          onClose={() => setSelectedProduct(null)}
          onConfirm={handlePurchase}
          loading={purchaseLoading}
        />
      )}
    </div>
  );
};

const ProductCard: React.FC<{ product: Product; onQuickBuy: () => void }> = ({ product, onQuickBuy }) => {
  const hasRating = typeof product.rating === 'number';

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-2xl p-6 hover:border-neonOrange transition-all hover:scale-[1.02] flex flex-col gap-4"
    >
      {product.image && (
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform"
          />
        </div>
      )}
      <h3 className="text-xl font-bold text-white group-hover:text-neonOrange transition-colors">
        {product.name}
      </h3>
      {product.description && (
        <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>
      )}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-neonOrange font-bold text-lg">
          {parseFloat(product.price).toLocaleString()} تومان
        </span>
        {hasRating && (
          <span className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4" />
            {product.rating!.toFixed(1)}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          onQuickBuy();
        }}
        className="mt-4 w-full py-2 border border-neonOrange/50 text-neonOrange rounded-lg hover:bg-neonOrange/20 transition-colors"
      >
        خرید سریع
      </button>
    </Link>
  );
};

interface QuickPurchaseModalProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
}

const QuickPurchaseModal: React.FC<QuickPurchaseModalProps> = ({
  product,
  quantity,
  onQuantityChange,
  onClose,
  onConfirm,
  loading,
}) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="relative max-w-lg w-full bg-dark-card/95 border border-neonOrange/30 rounded-2xl p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 left-3 text-gray-400 hover:text-neonOrange transition-colors"
          aria-label="close quick purchase"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-2xl font-bold text-neonOrange mb-4">خرید سریع</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {product.image && (
              <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-xl" />
            )}
            <div>
              <h4 className="text-xl font-bold text-white mb-2">{product.name}</h4>
              <p className="text-neonOrange font-bold">
                {parseFloat(product.price).toLocaleString()} تومان
              </p>
            </div>
          </div>
          {product.description && (
            <p className="text-gray-400 text-sm leading-6 bg-dark-surface/60 border border-neonOrange/20 rounded-xl p-4">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-gray-300">تعداد</span>
            <div className="flex items-center gap-3 bg-dark-surface border border-neonOrange/30 rounded-lg px-3 py-2">
              <button
                type="button"
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                className="text-neonOrange hover:text-neonOrange-light"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-white font-bold w-6 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => onQuantityChange(quantity + 1)}
                className="text-neonOrange hover:text-neonOrange-light"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="w-full py-3 neon-button rounded-lg text-white font-bold text-lg transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'در حال پردازش...' : 'افزودن به سبد و ادامه خرید'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

