import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CreditCard, ArrowLeft, ShoppingCart, Loader2, ShieldCheck } from 'lucide-react';
import { cartAPI, ordersAPI } from '../services/api';
import { resolveMediaUrl, getProductPrimaryImage, formatPriceLabel, extractPriceValue } from '../utils/product';
import OvyraPageShell from '../components/ovyra/OvyraPageShell';
import OvyraPageHeader from '../components/ovyra/OvyraPageHeader';

interface CartItem {
  id: string;
  product: any;
  product_name?: string;
  product_image?: string;
  quantity: number;
  price: any;
  total_price: any;
  discount_amount?: any;
  variant_name?: string;
  status?: string;
}

interface Cart {
  id: string;
  items: CartItem[];
  subtotal?: any;
  discount_amount?: any;
  total?: any;
  total_amount?: any;
}

type PaymentMethod = 'online' | 'wallet' | 'credit';

const PAYMENT_METHODS: Array<{
  value: PaymentMethod;
  label: string;
  description: string;
  disabled?: boolean;
}> = [
  {
    value: 'online',
    label: 'پرداخت اینترنتی (زرین‌پال)',
    description: 'انتقال به درگاه زرین‌پال و پرداخت آنلاین با کارت شتاب',
  },
  {
    value: 'wallet',
    label: 'پرداخت از اعتبار داخلی',
    description: 'به‌زودی فعال خواهد شد',
    disabled: true,
  },
  {
    value: 'credit',
    label: 'پرداخت آفلاین / کارت به کارت',
    description: 'ویژه هماهنگی دستی با پشتیبانی (به‌زودی)',
    disabled: true,
  },
];

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online');
  const [notes, setNotes] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);

  useEffect(() => {
    const fetchActiveCart = async () => {
      try {
        setLoading(true);
        const activeCart = await cartAPI.getActive();
        setCart(activeCart);
      } catch (error: any) {
        console.error('Checkout cart fetch error:', error);
        const message = error?.message?.replace(/^API Error:\s*/i, '') || 'در دریافت اطلاعات سبد خرید خطایی رخ داد';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveCart();
  }, []);

  const normalizedCart = useMemo(() => {
    if (!cart) return null;

    const normalizeNumber = (value: any): number => {
      if (value === null || value === undefined) return 0;
      const parsed = Number.parseFloat(String(value));
      return Number.isFinite(parsed) ? parsed : 0;
    };

    // فیلتر کردن آیتم‌های removed
    const activeItems = (cart.items || []).filter(item => item.status === 'active' || !item.status);
    
    const parsedItems = activeItems.map((item) => {
      const unitPrice =
        extractPriceValue({ price: item.price }) ?? normalizeNumber(item.price);
      const totalPrice =
        extractPriceValue({ price: item.total_price }) ?? normalizeNumber(item.total_price ?? unitPrice);
      const discount =
        extractPriceValue({ price: item.discount_amount }) ?? normalizeNumber(item.discount_amount);
      const productImage = resolveMediaUrl(item.product_image) || getProductPrimaryImage(item.product);
      const productName = item.product?.name || item.product_name || 'محصول';

      return {
        ...item,
        productName,
        productImage,
        unitPrice,
        totalPrice,
        discount,
        unitPriceLabel: formatPriceLabel(unitPrice),
        totalPriceLabel: formatPriceLabel(totalPrice),
        discountLabel: formatPriceLabel(discount),
      };
    });

    const subtotalFromCart = normalizeNumber(cart.subtotal ?? cart.total ?? cart.total_amount ?? 0);
    const computedSubtotal = parsedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const subtotal =
      extractPriceValue({ price: cart.subtotal }) ??
      (parsedItems.length > 0 ? computedSubtotal : subtotalFromCart);

    const discountFromCart = normalizeNumber(cart.discount_amount);
    const computedDiscount = parsedItems.reduce((sum, item) => sum + item.discount, 0);
    const discountTotal =
      extractPriceValue({ price: cart.discount_amount }) ??
      (parsedItems.length > 0 ? computedDiscount : discountFromCart);

    const total =
      extractPriceValue({ price: cart.total }) ??
      extractPriceValue({ price: cart.total_amount }) ??
      (subtotal - discountTotal);

    return {
      ...cart,
      items: parsedItems,
      subtotal,
      discountTotal,
      total,
      subtotalLabel: formatPriceLabel(subtotal),
      discountLabel: formatPriceLabel(discountTotal),
      totalLabel: formatPriceLabel(total),
    };
  }, [cart]);

  const handleCreateOrderAndPay = async () => {
    if (!cart || !normalizedCart || normalizedCart.items.length === 0) {
      toast('سبد خرید شما خالی است', { icon: '🛒' });
      return;
    }

    setProcessing(true);
    try {
      const orderPayload: Record<string, any> = {
        cart: cart.id,
        payment_method: paymentMethod,
      };

      if (notes.trim()) {
        orderPayload.notes = notes.trim();
      }

      const order = await ordersAPI.create(orderPayload);
      toast.success('سفارش با موفقیت ثبت شد. در حال انتقال به درگاه پرداخت...');

      if (paymentMethod === 'online') {
        try {
          const paymentResponse = await ordersAPI.processPayment(order.id, {});
          if (paymentResponse?.payment_url) {
            window.location.href = paymentResponse.payment_url;
            return;
          }

          toast.success('پرداخت با موفقیت ثبت شد.');
          navigate(`/orders`);
        } catch (paymentError: any) {
          console.error('Process payment error:', paymentError);
          const message =
            paymentError?.payload?.message ||
            paymentError?.payload?.error ||
            paymentError?.message?.replace(/^API Error:\s*/i, '') ||
            'ثبت پرداخت با خطا مواجه شد. می‌توانید بعداً از صفحه سفارشات پرداخت را تکمیل کنید.';
          toast.error(message);
          navigate('/orders');
        }
      } else {
        toast.success('سفارش شما ثبت شد. برای هماهنگی پرداخت با پشتیبانی در ارتباط باشید.');
        navigate('/orders');
      }
    } catch (createError: any) {
      console.error('Order creation error:', createError);
      const message =
        createError?.payload?.message ||
        createError?.payload?.error ||
        createError?.message?.replace(/^API Error:\s*/i, '') ||
        'در ثبت سفارش خطایی رخ داد';
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <OvyraPageShell glow={false}>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-14 w-14 animate-spin text-ovyra-gold" />
        </div>
      </OvyraPageShell>
    );
  }

  if (!normalizedCart || normalizedCart.items.length === 0) {
    return (
      <OvyraPageShell>
        <div className="mx-auto max-w-lg px-5 py-24 text-center">
          <ShoppingCart className="mx-auto mb-6 h-20 w-20 text-ovyra-gold/60" />
          <h2 className="font-display text-3xl text-white">سبد خالی است</h2>
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
          eyebrow="CHECKOUT"
          title="تکمیل خرید"
          description="بررسی سفارش و پرداخت امن از طریق زرین‌پال."
          action={
            <Link to="/cart" className="ovyra-btn-ghost inline-flex items-center gap-2 !py-2 text-sm">
              <ArrowLeft className="h-4 w-4" />
              بازگشت به سبد
            </Link>
          }
        />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="ovyra-neon-panel p-6">
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg tracking-[0.12em] text-white">
                <ShoppingCart className="h-5 w-5 text-ovyra-gold" />
                آیتم‌های سبد
              </h2>

              <div className="space-y-4">
                {normalizedCart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 bg-dark-surface/50 rounded-lg p-4 border border-transparent hover:border-neonOrange/40 transition-colors"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-dark-surface border border-neonOrange/20 flex-shrink-0">
                      {item.productImage ? (
                        <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                          بدون تصویر
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{item.productName}</h3>
                        <span className="text-neonOrange font-bold">{item.totalPriceLabel}</span>
                      </div>
                      <div className="text-sm text-gray-400 flex flex-wrap gap-3">
                        <span>تعداد: {item.quantity}</span>
                        <span>قیمت واحد: {item.unitPriceLabel}</span>
                        {item.variant_name && <span>نوع: {item.variant_name}</span>}
                        {item.discount > 0 && <span className="text-green-400">تخفیف: {item.discountLabel}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="ovyra-neon-panel p-6">
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg tracking-[0.12em] text-white">
                <CreditCard className="h-5 w-5 text-ovyra-gold" />
                روش پرداخت
              </h2>

              <div className="space-y-4">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.value}
                    className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all ${
                      method.value === paymentMethod
                        ? 'border-ovyra-violet/70 bg-ovyra-violet/10'
                        : 'border-white/15 hover:border-ovyra-violet/40'
                    } ${method.disabled ? 'cursor-not-allowed opacity-60' : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={method.value}
                      disabled={method.disabled}
                      checked={paymentMethod === method.value}
                      onChange={() => setPaymentMethod(method.value)}
                      className="mt-1 accent-neonOrange"
                    />
                    <div>
                      <p className="text-lg font-semibold text-white">{method.label}</p>
                      <p className="text-sm text-gray-400 mt-1">{method.description}</p>
                      {method.value === 'online' && (
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4" />
                          تراکنش از طریق درگاه امن زرین‌پال انجام می‌شود.
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </section>

            <section className="ovyra-neon-panel p-6">
              <h2 className="mb-4 font-display text-lg tracking-[0.12em] text-white">توضیحات (اختیاری)</h2>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="درخواست خاص یا یادداشت سفارش..."
                className="ovyra-input min-h-[120px] resize-none"
              />
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="ovyra-neon-panel sticky top-24 space-y-6 p-6">
              <div>
                <h2 className="mb-4 font-display text-lg tracking-[0.12em] text-white">خلاصه</h2>
                <div className="space-y-3 text-sm text-ovyra-mist/75">
                  <div className="flex justify-between">
                    <span>جمع کل</span>
                    <span>{normalizedCart.subtotalLabel}</span>
                  </div>
                  {normalizedCart.discountTotal > 0 && (
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
              </div>

              <p className="rounded-lg border border-ovyra-violet/30 bg-ovyra-violet/10 px-4 py-3 text-xs leading-relaxed text-ovyra-mist/80">
                پس از «تکمیل و پرداخت»، به درگاه زرین‌پال منتقل می‌شوید.
              </p>

              <button
                onClick={handleCreateOrderAndPay}
                disabled={processing}
                className="ovyra-btn-neon flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    در حال پردازش...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    تکمیل و پرداخت
                  </>
                )}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </OvyraPageShell>
  );
};

export default CheckoutPage;


