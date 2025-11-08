import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader, ArrowRight, Star } from 'lucide-react';
import { categoriesAPI } from '../services/api';
import { resolveMediaUrl, extractPriceValue, formatPriceLabel, isProductAvailable } from '../utils/product';

interface Product {
  id: string;
  name: string;
  description?: string;
  price?: any;
  discount_price?: any;
  final_price?: any;
  image?: string;
  rating?: number;
  priceValue?: number | null;
  priceLabel?: string;
  isPurchasable?: boolean;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

const CategoryProductsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [categoryDetail, categoryProducts] = await Promise.all([
          categoriesAPI.getById(id),
          categoriesAPI.getProducts<Product>(id),
        ]);
        setCategory(categoryDetail);
        const normalized = categoryProducts.map((item) => {
          const priceValue = extractPriceValue(item);
          return {
            ...item,
            image: resolveMediaUrl(item.image) ?? item.image,
            priceValue,
            priceLabel: formatPriceLabel(priceValue),
            isPurchasable: isProductAvailable(item),
          };
        });
        setProducts(normalized);
      } catch (error) {
        console.error('Error loading category products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 pb-20 flex items-center justify-center">
        <Loader className="w-12 h-12 text-neonOrange animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 neon-bg">
        <div className="absolute top-0 left-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mt-8 mb-10 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold neon-glow mb-4">
              {category?.name || 'محصولات دسته بندی'}
            </h1>
            {category?.description && (
              <p className="text-gray-300 max-w-3xl leading-7">
                {category.description}
              </p>
            )}
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-neonOrange hover:text-neonOrange-light transition-colors"
          >
            بازگشت به دسته بندی‌ها
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center text-gray-300 py-20">
            محصولی برای این دسته‌بندی یافت نشد.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
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
                    {product.priceLabel ?? formatPriceLabel(product.priceValue)}
                  </span>
                  {typeof product.rating === 'number' && (
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4" />
                      {product.rating!.toFixed(1)}
                    </span>
                  )}
                </div>
                {!product.isPurchasable && (
                  <span className="text-xs text-red-400">ناموجود</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProductsPage;
