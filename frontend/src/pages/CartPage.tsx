import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Tag, Loader2 } from 'lucide-react';
import { cartAPI } from '../services/api';
import { resolveMediaUrl, getProductPrimaryImage } from '../utils/product';
import { matchArchiveFigure } from '../brand/ovyra';
import OvyraPageShell from '../components/ovyra/OvyraPageShell';
import OvyraPageHeader from '../components/ovyra/OvyraPageHeader';

interface CartItem {
  id: string;
  product: unknown;
  quantity: number;
  price: unknown;
  total_price: unknown;
  final_price?: unknown;
  final_price_discount?: unknown;
  product_name?: string;
  product_image?: string;
  discount_amount?: unknown;
  variant_name?: string;
  status?: string;
}

interface Cart {
  id: string;
  items: CartItem[];
  subtotal: unknown;
  discount_amount: unknown;
  total?: unknown;
  coupon?: { code: string };
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');

  const parseAmount = (value: unknown): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    if (typeof value === 'string') {
      const normalized = value.replace(/[^0-9.-]/g, '');
      const parsed = Number.parseFloat(normalized);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };

  const formatAmount = (value: unknown): string => {
    const amount = parseAmount(value);
    return `${amount.toLocaleString('fa-IR')} تومان`;
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const activeCart = await cartAPI.getActive();
      setCart(activeCart);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const normalizedCart = useMemo(() => {
    if (!cart) return null;
    const activeItems = (cart.items || []).filter((item) => item.status === 'active' || !item.status);

    const normalizedItems = activeItems.map((item) => {
      const quantity = item.quantity ?? 1;
      const unitPrice = parseAmount(item.price ?? item.final_price);
      const discountAmount = parseAmount(item.discount_amount ?? item.final_price_discount ?? 0);
      const subtotal = unitPrice * quantity;
      const totalPrice = parseAmount(item.total_price ?? item.final_price ?? subtotal - discountAmount);
      const image = resolveMediaUrl(item.product_image) || getProductPrimaryImage(item.product);
      return {
        ...item,
        quantity,
        unitPrice,
        totalPrice,
        subtotal,
        discountAmount,
        unitPriceLabel: formatAmount(unitPrice),
        totalPriceLabel: formatAmount(totalPrice),
        productName: item.product_name || (item.product as { name?: string })?.name,
        productImage: image,
      };
    });

    const subtotalValueFromBackend = parseAmount(
      (cart as { subtotal?: unknown; total?: unknown; total_amount?: unknown }).subtotal ??
        (cart as { total?: unknown }).total ??
        (cart as { total_amount?: unknown }).total_amount ??
        0
    );
    const subtotalSum = normalizedItems.reduce((sum, item) => sum + item.subtotal, 0);
    const subtotalValue = normalizedItems.length > 0 ? subtotalSum : subtotalValueFromBackend;
    const discountValueFromBackend = parseAmount((cart as { discount_amount?: unknown }).discount_amount ?? 0);
    const discountSum = normalizedItems.reduce((sum, item) => sum + item.discountAmount, 0);
    const discountValue = normalizedItems.length > 0 ? discountSum : discountValueFromBackend;
    const totalValueFromBackend = parseAmount(
      (cart as { total?: unknown; total_amount?: unknown }).total ??
        (cart as { total_amount?: unknown }).total_amount ??
        0
    );
    const totalComputed = subtotalValue - discountValue;
    const totalValue = normalizedItems.length > 0 ? totalComputed : totalValueFromBackend;

    return {
      ...cart,
      items: normalizedItems,
      subtotalValue,
      discountValue,
      totalValue,
      subtotalLabel: formatAmount(subtotalValue),
      discountLabel: formatAmount(discountValue),
      totalLabel: formatAmount(totalValue),
    };
  }, [cart]);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (!cart || newQuantity < 1) return;
    try {
      await cartAPI.updateItem(cart.id, { item_id: itemId, quantity: newQuantity });
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!cart) return;
    try {
      await cartAPI.removeItem(cart.id, { item_id: itemId });
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleApplyCoupon = async () => {
    if (!cart || !couponCode) return;
    try {
      await cartAPI.applyCoupon(cart.id, couponCode);
      setCouponCode('');
      fetchCart();
    } catch (error) {
      console.error('Error applying coupon:', error);
    }
  };

  if (loading) {
    return (
      <OvyraPageShell glow={false}>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-ovyra-gold" />
        </div>
      </OvyraPageShell>
    );
  }

  if (!normalizedCart || normalizedCart.items.length === 0) {
    return (
      <OvyraPageShell>
        <div className="mx-auto max-w-lg px-5 py-24 text-center">
          <ShoppingCart className="mx-auto mb-6 h-20 w-20 text-ovyra-gold/60" />
          <h2 className="font-display text-3xl text-white">سبد آرشیو خالی است</h2>
          <p className="mt-4 text-ovyra-mist/70">هنوز شخصیتی به سبد اضافه نکرده‌اید.</p>
          <Link to="/products" className="ovyra-btn-neon mt-8 inline-flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            ورود به فروشگاه
          </Link>
        </div>
      </OvyraPageShell>
    );
  }

  return (
    <OvyraPageShell>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <OvyraPageHeader
          eyebrow="YOUR ARCHIVE"
          title="سبد خرید"
          description="قطعات Archive 01 در سبد شما"
          action={
            <Link to="/products" className="ovyra-btn-ghost inline-flex items-center gap-2 !py-2 text-sm">
              <ArrowLeft className="h-4 w-4" />
              ادامه خرید
            </Link>
          }
        />

        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4 md:col-span-2">
            {normalizedCart.items.map((item) => {
              const figure = matchArchiveFigure(item.productName);
              return (
                <div key={item.id} className="ovyra-neon-panel p-5 sm:p-6">
                  <div className="flex gap-5">
                    <div className="h-24 w-24 shrink-0 overflow-hidden border border-white/10 bg-ovyra-ink">
                      {item.productImage ? (
                        <img src={item.productImage} alt={item.productName || 'محصول'} className="h-full w-full object-cover" />
                      ) : (
                        <img src="/brand/archive-01-characters.png" alt="" className="h-full w-full object-cover opacity-40" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      {figure && (
                        <p className="font-display text-[10px] tracking-[0.3em]" style={{ color: figure.accent }}>
                          {figure.code}
                        </p>
                      )}
                      <h3 className="truncate text-lg font-semibold text-white">{item.productName || 'شخصیت'}</h3>
                      <p className="mt-1 text-sm text-ovyra-mist/60">قیمت واحد: {item.unitPriceLabel}</p>
                      {item.variant_name && (
                        <p className="text-xs text-ovyra-mist/45">نوع: {item.variant_name}</p>
                      )}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="rounded-lg border border-white/15 p-2 hover:border-ovyra-violet/50"
                          >
                            <Minus className="h-4 w-4 text-ovyra-gold" />
                          </button>
                          <span className="w-8 text-center font-semibold text-white">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="rounded-lg border border-white/15 p-2 hover:border-ovyra-violet/50"
                          >
                            <Plus className="h-4 w-4 text-ovyra-gold" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-display text-ovyra-gold">{item.totalPriceLabel}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="rounded-lg bg-red-500/15 p-2 hover:bg-red-500/25"
                          >
                            <Trash2 className="h-5 w-5 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="md:col-span-1">
            <div className="ovyra-neon-panel sticky top-24 p-6">
              <h2 className="font-display text-lg tracking-[0.15em] text-white">خلاصه سفارش</h2>

              <div className="mt-6">
                <label className="mb-2 block text-sm text-ovyra-mist/70">کد تخفیف</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="ovyra-input flex-1 !py-2"
                    placeholder="کد تخفیف"
                  />
                  <button type="button" onClick={handleApplyCoupon} className="ovyra-btn-primary !px-4 !py-2">
                    <Tag className="h-5 w-5" />
                  </button>
                </div>
                {cart?.coupon && (
                  <p className="mt-2 text-sm text-ovyra-gold">کد اعمال شد: {cart.coupon.code}</p>
                )}
              </div>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-6 text-sm">
                <div className="flex justify-between text-ovyra-mist/75">
                  <span>جمع کل</span>
                  <span>{normalizedCart.subtotalLabel}</span>
                </div>
                {normalizedCart.discountValue > 0 && (
                  <div className="flex justify-between text-ovyra-gold">
                    <span>تخفیف</span>
                    <span>-{normalizedCart.discountLabel}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-white/10 pt-3 font-display text-lg text-ovyra-gold">
                  <span>قابل پرداخت</span>
                  <span>{normalizedCart.totalLabel}</span>
                </div>
              </div>

              <Link to="/checkout" className="ovyra-btn-neon mt-6 block w-full text-center">
                ادامه به پرداخت
              </Link>
            </div>
          </div>
        </div>
      </div>
    </OvyraPageShell>
  );
};

export default CartPage;
