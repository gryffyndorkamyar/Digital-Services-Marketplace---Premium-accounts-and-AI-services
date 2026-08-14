import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import PageLoader from '../components/PageLoader';
import LandingPage from '../pages/LandingPage';

const LoginPage = lazy(() => import('../pages/LoginPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const CategoriesPage = lazy(() => import('../pages/CategoriesPage'));
const ProductsPage = lazy(() => import('../pages/ProductsPage'));
const CategoryProductsPage = lazy(() => import('../pages/CategoryProductsPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const OrdersPage = lazy(() => import('../pages/OrdersPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const ProductDetailPage = lazy(() => import('../pages/ProductDetailPage'));
const TermsPage = lazy(() => import('../pages/TermsPage'));
const PrivacyPage = lazy(() => import('../pages/PrivacyPage'));
const RefundPolicyPage = lazy(() => import('../pages/RefundPolicyPage'));
const SupportPage = lazy(() => import('../pages/SupportPage'));

const withLayout = (page: React.ReactNode) => <Layout>{page}</Layout>;

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={withLayout(<LandingPage />)} />
        <Route path="/login" element={withLayout(<LoginPage />)} />
        <Route path="/about" element={withLayout(<AboutPage />)} />
        <Route path="/contact" element={withLayout(<ContactPage />)} />
        <Route path="/categories" element={withLayout(<CategoriesPage />)} />
        <Route path="/categories/:id/products" element={withLayout(<CategoryProductsPage />)} />
        <Route path="/products" element={withLayout(<ProductsPage />)} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={withLayout(<CartPage />)} />
        <Route path="/checkout" element={withLayout(<CheckoutPage />)} />
        <Route path="/orders" element={withLayout(<OrdersPage />)} />
        <Route path="/profile" element={withLayout(<ProfilePage />)} />
        <Route path="/terms" element={withLayout(<TermsPage />)} />
        <Route path="/privacy" element={withLayout(<PrivacyPage />)} />
        <Route path="/refund-policy" element={withLayout(<RefundPolicyPage />)} />
        <Route path="/support" element={withLayout(<SupportPage />)} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
