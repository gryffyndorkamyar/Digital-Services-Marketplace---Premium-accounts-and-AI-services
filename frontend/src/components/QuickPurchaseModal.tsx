import React from 'react';
import { Minus, Plus, X, Star } from 'lucide-react';
import { QuickPurchaseProduct } from '../hooks/useQuickPurchase';
import { resolveMediaUrl } from '../utils/product';

interface QuickPurchaseModalProps {
  product: QuickPurchaseProduct;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onClose: () => void;
  onConfirm: () => void;
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
  const hasRating = typeof (product as any)?.raw?.rating === 'number' || typeof (product as any).rating === 'number';
  const ratingValue = (product as any)?.raw?.rating ?? (product as any).rating;
  const imageSrc = resolveMediaUrl(product.image) ?? product.image;

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
            {imageSrc && (
              <img src={imageSrc} alt={product.name} className="w-24 h-24 object-cover rounded-xl" />
            )}
            <div>
              <h4 className="text-xl font-bold text-white mb-2">{product.name}</h4>
              <p className="text-neonOrange font-bold">{product.priceLabel}</p>
              {hasRating && typeof ratingValue === 'number' && (
                <span className="inline-flex items-center gap-1 text-yellow-400 text-sm">
                  <Star className="w-4 h-4" />
                  {Number(ratingValue).toFixed(1)}
                </span>
              )}
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

export default QuickPurchaseModal;
