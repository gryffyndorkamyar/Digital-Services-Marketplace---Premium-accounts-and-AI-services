import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { cartAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export interface QuickPurchaseProduct {
  id: string;
  name: string;
  price: string;
  description?: string;
  image?: string;
}

export const useQuickPurchase = () => {
  const { isAuthenticated, showAuthModal } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState<QuickPurchaseProduct | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const openQuickPurchase = useCallback(
    (product: QuickPurchaseProduct, skipAuthCheck = false) => {
      if (!skipAuthCheck && !isAuthenticated) {
        toast('برای خرید ابتدا وارد حساب شوید', { icon: '⚠️' });
        showAuthModal({ onSuccess: () => openQuickPurchase(product, true) });
        return;
      }
      setProduct(product);
      setQuantity(1);
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
      await cartAPI.addItem(cart.id, {
        product_id: product.id,
        quantity,
      });
      toast.success('محصول به سبد خرید اضافه شد');
      closeQuickPurchase();
      navigate('/cart');
    } catch (error: any) {
      console.error('Quick purchase error:', error);
      toast.error(error?.message || 'در خرید محصول خطایی رخ داد');
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
