import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { cartAPI, productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { buildQuickPurchasePayload, isProductAvailable } from '../utils/product';

export interface QuickPurchaseProduct {
  id: string;
  name: string;
  price: number | null;
  priceLabel: string;
  description?: string;
  image?: string;
  variantId?: string | null;
  raw?: any;
}

export const useQuickPurchase = () => {
  const { isAuthenticated, showAuthModal } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState<QuickPurchaseProduct | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const openQuickPurchase = useCallback(
    async (productLike: any, skipAuthCheck = false) => {
      if (!skipAuthCheck && !isAuthenticated) {
        toast('برای خرید ابتدا وارد حساب شوید', { icon: '⚠️' });
        showAuthModal({ onSuccess: () => openQuickPurchase(productLike, true) });
        return;
      }

      if (!productLike?.id) {
        toast.error('اطلاعات محصول نامعتبر است');
        return;
      }

      const initialStockFlag = productLike?.is_in_stock;
      const initialVariantStock =
        (productLike?.is_unlimited_stock === true) ||
        (productLike?.stock_quantity ?? productLike?.inventory ?? 0) > 0 ||
        (productLike?.default_variant?.is_unlimited_stock === true) ||
        (productLike?.default_variant?.stock_quantity ?? productLike?.default_variant?.inventory ?? 0) > 0;

      if (initialStockFlag === false || (initialStockFlag === undefined && !initialVariantStock)) {
        toast('این محصول در حال حاضر موجود نیست. بزودی موجود خواهد شد.', { icon: '🕒' });
        return;
      }

      try {
        setLoading(true);
        let sourceProduct = productLike;
        if (!productLike?.pricingLoaded) {
          sourceProduct = await productsAPI.getById(productLike.id);
        }

        const payload = buildQuickPurchasePayload(sourceProduct);

        setProduct(payload);
        setQuantity(1);
      } catch (error: any) {
        console.error('Quick purchase init error:', error);
        toast.error(error?.message || 'در آماده‌سازی خرید سریع خطایی رخ داد');
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, showAuthModal]
  );

  const closeQuickPurchase = useCallback(() => {
    setProduct(null);
    setQuantity(1);
  }, []);

  const ensureCart = useCallback(async () => {
    try {
      const active = await cartAPI.getActive();
      if (active?.id) {
        return active;
      }
    } catch (error) {
      // در صورت نبود سبد فعال، یکی ایجاد می‌کنیم
    }
    return cartAPI.create();
  }, []);

  const confirmPurchase = useCallback(async () => {
    if (!product) return;
    try {
      setLoading(true);
      const cart = await ensureCart();
      if (!cart?.id) {
        throw new Error('عدم توانایی در ایجاد سبد خرید');
      }
      const payload: Record<string, any> = {
        product_id: product.id,
        quantity,
      };
      if (product.variantId) {
        payload.variant_id = product.variantId;
      }

      await cartAPI.addItem(cart.id, payload);
      toast.success('محصول به سبد خرید اضافه شد');
      closeQuickPurchase();
      navigate('/cart');
    } catch (error: any) {
      console.error('Quick purchase error:', error);
      const backendMessage = error?.payload?.detail || error?.payload?.error;
      const message = backendMessage || String(error?.message || 'در خرید محصول خطایی رخ داد').replace(/^API Error:\s*/i, '');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [product, quantity, ensureCart, closeQuickPurchase, navigate]);

  return {
    openQuickPurchase,
    quickPurchaseState: {
      product,
      quantity,
      setQuantity,
      close: closeQuickPurchase,
      confirm: confirmPurchase,
      loading,
    },
  } as const;
};
