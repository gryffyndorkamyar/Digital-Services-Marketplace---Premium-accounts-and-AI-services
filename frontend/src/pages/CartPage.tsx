import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Tag } from 'lucide-react';
import { cartAPI } from '../services/api';

interface CartItem {
  id: string;
  product: any;
  quantity: number;
  price: string;
  total_price: string;
}

interface Cart {
  id: string;
  items: CartItem[];
  subtotal: string;
  discount_amount: string;
  total_amount: string;
  coupon?: any;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');

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
      <div className="min-h-screen pt-16 pb-20 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-neonOrange mx-auto mb-4 animate-spin" />
          <p className="text-gray-300">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen pt-16 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 neon-bg">
          <div className="absolute top-0 left-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center pt-20">
          <ShoppingCart className="w-24 h-24 text-neonOrange mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4 text-neonOrange">سبد خرید شما خالی است</h2>
          <p className="text-gray-300 mb-8">محصولی به سبد خرید اضافه نشده است</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 neon-button rounded-lg text-white font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
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
        <div className="flex items-center justify-between mb-8 mt-8">
          <h1 className="text-4xl md:text-5xl font-bold neon-glow">سبد خرید</h1>
          <Link
            to="/products"
            className="flex items-center gap-2 text-gray-300 hover:text-neonOrange transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            ادامه خرید
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* لیست محصولات */}
          <div className="md:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-xl p-6 hover:border-neonOrange/50 transition-all"
              >
                <div className="flex gap-6">
                  {item.product?.image && (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2 text-neonOrange">
                      {item.product?.name || 'محصول'}
                    </h3>
                    <p className="text-gray-300 mb-4">
                      قیمت واحد: {parseFloat(item.price).toLocaleString()} تومان
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-2 bg-dark-surface rounded-lg hover:bg-neonOrange/20 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-neonOrange" />
                        </button>
                        <span className="text-white font-bold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-2 bg-dark-surface rounded-lg hover:bg-neonOrange/20 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-neonOrange" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-white font-bold">
                          {parseFloat(item.total_price).toLocaleString()} تومان
                        </span>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* خلاصه سبد خرید */}
          <div className="md:col-span-1">
            <div className="bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-neonOrange">خلاصه سفارش</h2>

              {/* کد تخفیف */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  کد تخفیف
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-4 py-2 bg-dark-surface border border-neonOrange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonOrange focus:ring-2 focus:ring-neonOrange/50"
                    placeholder="کد تخفیف"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-neonOrange text-white rounded-lg hover:bg-neonOrange-light transition-colors"
                  >
                    <Tag className="w-5 h-5" />
                  </button>
                </div>
                {cart.coupon && (
                  <p className="text-sm text-neonOrange mt-2">
                    کد تخفیف اعمال شد: {cart.coupon.code}
                  </p>
                )}
              </div>

              {/* قیمت‌ها */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>جمع کل:</span>
                  <span>{parseFloat(cart.subtotal).toLocaleString()} تومان</span>
                </div>
                {parseFloat(cart.discount_amount) > 0 && (
                  <div className="flex justify-between text-neonOrange">
                    <span>تخفیف:</span>
                    <span>-{parseFloat(cart.discount_amount).toLocaleString()} تومان</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-neonOrange pt-3 border-t border-neonOrange/30">
                  <span>مبلغ قابل پرداخت:</span>
                  <span>{parseFloat(cart.total_amount).toLocaleString()} تومان</span>
                </div>
              </div>

              {/* دکمه پرداخت */}
              <Link
                to="/checkout"
                className="w-full py-3 px-4 neon-button rounded-lg text-white font-bold text-center block transition-all hover:scale-105"
              >
                ادامه به پرداخت
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

