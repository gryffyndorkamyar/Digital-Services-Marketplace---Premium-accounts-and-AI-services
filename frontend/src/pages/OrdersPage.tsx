import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { ordersAPI } from '../services/api';

interface OrderItem {
  id: string;
  product: any;
  quantity: number;
  price: string;
  total_price: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: string;
  items: OrderItem[];
  created_at: string;
  can_cancel: boolean;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await ordersAPI.getAll<Order>();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen pt-16 pb-20 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-neonOrange mx-auto mb-4 animate-spin" />
          <p className="text-gray-300">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen pt-16 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 neon-bg">
          <div className="absolute top-0 left-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center pt-20">
          <Package className="w-24 h-24 text-neonOrange mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4 text-neonOrange">سفارشی ثبت نشده است</h2>
          <p className="text-gray-300 mb-8">شما هنوز سفارشی ثبت نکرده‌اید</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 neon-button rounded-lg text-white font-bold"
          >
            مشاهده محصولات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-20 px-4 relative overflow-hidden">
      {/* پس‌زمینه نئونی */}
      <div className="absolute inset-0 neon-bg">
        <div className="absolute top-0 left-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* هدر */}
        <div className="mb-8 mt-8">
          <h1 className="text-4xl md:text-5xl font-bold neon-glow mb-2">سفارشات من</h1>
          <p className="text-gray-300">تاریخچه سفارشات شما</p>
        </div>

        {/* لیست سفارشات */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-xl p-6 hover:border-neonOrange/50 transition-all"
            >
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
                      {parseFloat(order.total_amount).toLocaleString()} تومان
                    </p>
                  </div>
                </div>
              </div>

              {/* محصولات */}
              <div className="space-y-4 mb-6">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 bg-dark-surface/50 rounded-lg p-4"
                  >
                    {item.product?.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold text-white">{item.product?.name || 'محصول'}</h4>
                      <p className="text-sm text-gray-400">
                        تعداد: {item.quantity} × {parseFloat(item.price).toLocaleString()} تومان
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-neonOrange">
                        {parseFloat(item.total_price).toLocaleString()} تومان
                      </p>
                    </div>
                  </div>
                ))}
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

