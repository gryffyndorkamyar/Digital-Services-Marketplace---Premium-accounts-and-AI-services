import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Loader } from 'lucide-react';
import { productsAPI } from '../services/api';
import QuickPurchaseModal from '../components/QuickPurchaseModal';
import { useQuickPurchase } from '../hooks/useQuickPurchase';
import {
  extractPriceValue,
  formatPriceLabel,
  isProductAvailable,
  getProductPrimaryImage,
} from '../utils/product';
import { toast } from 'react-hot-toast';
import { ARCHIVE_01, BRAND, COPY } from '../brand/ovyra';
import OvyraPageShell from '../components/ovyra/OvyraPageShell';
import OvyraPageHeader from '../components/ovyra/OvyraPageHeader';
import OvyraProductCard, { OvyraProduct } from '../components/ovyra/OvyraProductCard';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<OvyraProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { openQuickPurchase, quickPurchaseState } = useQuickPurchase();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const all = await productsAPI.getAll<OvyraProduct>();
        const normalize = (list: OvyraProduct[]) =>
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
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('خطا در بارگذاری آرشیو');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const term = searchTerm.toLowerCase();
    return products.filter(
      (product) =>
        product.name?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  const showArchiveFallback = !loading && filteredProducts.length === 0;

  return (
    <OvyraPageShell>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <OvyraPageHeader
          eyebrow={`${BRAND.series} · ${BRAND.archive}`}
          title={
            <>
              {COPY.shop.title}
              <span className="mt-2 block font-display text-2xl tracking-[0.2em] text-ovyra-violet sm:text-3xl">
                {COPY.shop.titleEn}
              </span>
            </>
          }
          description={COPY.shop.lead}
          action={
            <Link to="/" className="ovyra-btn-ghost hidden sm:inline-flex">
              بازگشت به آرشیو
            </Link>
          }
        />

        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ovyra-gold" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ovyra-input pr-10"
              placeholder={COPY.shop.searchPlaceholder}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader className="h-12 w-12 animate-spin text-ovyra-gold" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <OvyraProductCard
                key={product.id}
                product={product}
                onQuickBuy={() => openQuickPurchase(product)}
              />
            ))}
          </div>
        ) : showArchiveFallback ? (
          <div>
            <p className="font-fa mb-8 text-center text-ovyra-mist/70">{COPY.shop.fallbackLead}</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ARCHIVE_01.map((figure) => (
                <article
                  key={figure.code}
                  className="ovyra-product-card overflow-hidden"
                  style={{ ['--card-accent' as string]: figure.accent }}
                >
                  <div className="relative h-52 bg-ovyra-ink">
                    <img
                      src="/brand/archive-01-characters.png"
                      alt={figure.nameFa}
                      className="h-full w-full object-cover object-top opacity-50"
                    />
                    <span
                      className="absolute left-3 top-3 font-display text-[10px] tracking-[0.35em]"
                      style={{ color: figure.accent }}
                    >
                      {figure.code}
                    </span>
                  </div>
                  <div className="space-y-2 p-5">
                    <h3 className="text-lg font-semibold text-white">{figure.nameFa}</h3>
                    <p className="font-display text-[10px] tracking-[0.22em] text-ovyra-mist/50">{figure.name}</p>
                    <p className="text-sm italic text-ovyra-mist/65">{figure.tagline}</p>
                    <span className="inline-block pt-2 font-display text-xs tracking-[0.3em] text-ovyra-gold/70">
                      COMING TO SHOP
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="font-fa py-20 text-center text-ovyra-mist/70">{COPY.shop.emptySearch}</div>
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

export default ProductsPage;
