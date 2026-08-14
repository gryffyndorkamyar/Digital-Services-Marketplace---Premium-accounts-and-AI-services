import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Package, Eye, X, CheckCircle, Clock, AlertCircle, LogIn, CreditCard, Loader2 } from 'lucide-react';
import { ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPriceLabel, extractPriceValue, getProductPrimaryImage } from '../utils/product';
import OvyraPageShell from '../components/ovyra/OvyraPageShell';
import OvyraPageHeader from '../components/ovyra/OvyraPageHeader';

interface OrderItem {
  id: string;
  product: any;
  quantity: number;
  price: any;
  total_price: any;
  product_name?: string;
  product_image?: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: any;
  items: OrderItem[];
  created_at: string;
  can_cancel: boolean;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const { isAuthenticated, loading: authLoading, showAuthModal } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const paymentToastShown = useRef(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const ordersData = await ordersAPI.getAll<Order>();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleProcessPayment = useCallback(
    async (orderId: string) => {
      setProcessingOrderId(orderId);
      try {
        const response = await ordersAPI.processPayment(orderId, {});
        if (response?.payment_url) {
          window.location.href = response.payment_url;
          return;
        }
        toast.success('پرداخت با موفقیت ثبت شد.');
        fetchOrders();
      } catch (error: any) {
        console.error('Process payment error:', error);
        const message =
          error?.payload?.message ||
          error?.payload?.error ||
          error?.message?.replace(/^API Error:\s*/i, '') ||
          'در ایجاد پرداخت خطایی رخ داد';
        toast.error(message);
      } finally {
        setProcessingOrderId(null);
      }
    },
    [fetchOrders]
  );

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      setOrders([]);
      return;
    }
    fetchOrders();
  }, [isAuthenticated, fetchOrders]);

  // بازگشت از درگاه زرین‌پال — فقط toast، بدون تغییر UI
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (!paymentStatus || paymentToastShown.current) return;
    paymentToastShown.current = true;

    if (paymentStatus === 'success') {
      toast.success('پرداخت با موفقیت انجام شد.');
      if (isAuthenticated) fetchOrders();
    } else if (paymentStatus === 'cancelled') {
      toast.error('پرداخت لغو شد.');
    } else {
      toast.error('تایید پرداخت ناموفق بود.');
    }

    const next = new URLSearchParams(searchParams);
    next.delete('payment');
    next.delete('order');
    next.delete('message');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams, isAuthenticated, fetchOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'cancelled':
        return <X className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  if (authLoading || loading) {
    return (
      <OvyraPageShell glow={false}>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-ovyra-gold" />
        </div>
      </OvyraPageShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <OvyraPageShell>
        <div className="mx-auto max-w-lg px-5 py-24 text-center">
          <Package className="mx-auto mb-6 h-20 w-20 text-ovyra-gold/60" />
          <h2 className="font-display text-3xl text-white">ورود لازم است</h2>
          <p className="mt-4 text-ovyra-mist/70">برای مشاهده سفارش‌های آرشیو وارد شوید.</p>
          <button type="button" onClick={() => showAuthModal()} className="ovyra-btn-neon mt-8 inline-flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            ورود / ثبت‌نام
          </button>
        </div>
      </OvyraPageShell>
    );
  }

  if (orders.length === 0) {
    return (
      <OvyraPageShell>
        <div className="mx-auto max-w-lg px-5 py-24 text-center">
          <Package className="mx-auto mb-6 h-20 w-20 text-ovyra-gold/60" />
          <h2 className="font-display text-3xl text-white">هنوز سفارشی ندارید</h2>
          <Link to="/products" className="ovyra-btn-neon mt-8 inline-flex items-center gap-2">
            ورود به فروشگاه
          </Link>
        </div>
      </OvyraPageShell>
    );
  }

  return (
    <OvyraPageShell>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <OvyraPageHeader eyebrow="ORDERS" title="سفارش‌های من" description="تاریخچه خرید Archive 01" />
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="ovyra-neon-panel p-6">
              {/* هدر سفارش */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neonOrange/20">
                <div>
                  <h3 className="text-xl font-bold text-neonOrange mb-2">
                    سفارش #{order.order_number}
                  </h3>
                  <p className="text-sm text-gray-400">
                    تاریخ: {new Date(order.created_at).toLocaleDateString('fa-IR')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="font-medium capitalize">{order.status}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">مبلغ کل:</p>
                    <p className="text-xl font-bold text-neonOrange">
                      {formatPriceLabel(extractPriceValue({ price: order.total_amount }) ?? Number.parseFloat(String(order.total_amount)))}
                    </p>
                  </div>
                </div>
              </div>

              {/* محصولات */}
              <div className="space-y-4 mb-6">
                {order.items.map((item) => {
                  const productName = item.product?.name || item.product_name;
                  const productImage = item.product_image || getProductPrimaryImage(item.product);
                  const unitPrice = extractPriceValue({ price: item.price }) ?? Number.parseFloat(String(item.price));
                  const totalPrice = extractPriceValue({ price: item.total_price }) ?? Number.parseFloat(String(item.total_price));
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 bg-dark-surface/50 rounded-lg p-4"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-dark-100 border border-neonOrange/20 flex-shrink-0">
                        {productImage ? (
                          <img src={productImage} alt={productName || 'محصول'} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">بدون تصویر</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="text-lg font-bold text-white">
                              {productName || 'محصول'}
                            </h4>
                            <p className="text-gray-400 text-sm">
                              قیمت واحد: {formatPriceLabel(unitPrice)}
                            </p>
                          </div>
                          <span className="text-neonOrange font-bold">
                            {formatPriceLabel(totalPrice)}
                          </span>
                        </div>
                        <div className="text-gray-400 text-sm">
                          تعداد: {item.quantity}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* دکمه‌های عملیات */}
              <div className="flex items-center justify-between pt-4 border-t border-neonOrange/20">
                <div className="flex gap-4">
                  <Link
                    to={`/orders/${order.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-neonOrange/20 text-neonOrange rounded-lg hover:bg-neonOrange/30 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    مشاهده جزئیات
                  </Link>
                  {order.payment_status === 'completed' && (
                    <Link
                      to={`/orders/${order.id}/download`}
                      className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                    >
                      دانلود محصولات
                    </Link>
                  )}
                </div>
                {order.can_cancel && (
                  <button
                    onClick={async () => {
                      try {
                        await ordersAPI.cancel(order.id);
                        fetchOrders();
                      } catch (error) {
                        console.error('Error cancelling order:', error);
                      }
                    }}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    لغو سفارش
                  </button>
                )}
                {order.payment_status !== 'completed' && (
                  <button
                    onClick={() => handleProcessPayment(order.id)}
                    disabled={processingOrderId === order.id}
                    className="flex items-center gap-2 px-4 py-2 bg-neonOrange text-white rounded-lg hover:bg-neonOrange-light transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {processingOrderId === order.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        در حال هدایت به درگاه...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        پرداخت سفارش
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </OvyraPageShell>
  );
};

export default OrdersPage;

