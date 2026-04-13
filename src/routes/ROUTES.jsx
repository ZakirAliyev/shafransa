import React from "react"

import PublicLayout from "../components/layout/PublicLayout"
import UserLayout from "../components/layout/UserLayout"
import SellerLayout from "../components/layout/SellerLayout"
import AdminLayout from "../components/layout/AdminLayout"

import LandingPage from "../pages/public/LandingPage"
import LoginPage from "../pages/auth/LoginPage"
import RegisterPage from "../pages/auth/RegisterPage"
import OTPPage from "../pages/auth/OTPPage"

import GlobalError from "../components/ui/GlobalError"
import GuestGuard from "../components/layout/GuestGuard"
import AuthGuard from "../components/layout/AuthGuard"

// Public Commerce
import Marketplace from "../pages/dashboard/Marketplace"
import AIConsultant from "../pages/dashboard/AIConsultant"
import CartPage from "../pages/public/CartPage"
import CheckoutPage from "../pages/public/CheckoutPage"
import ProductDetailsPage from "../pages/public/ProductDetailsPage"
import SellerStorefrontPage from "../pages/public/SellerStorefrontPage"

// Encyclopedia System — separate from marketplace
import EncyclopediaIndexPage from "../pages/public/EncyclopediaIndexPage"
import HerbDetailsPage from "../pages/public/HerbDetailsPage"

// Corporate Pages
import AboutPage from "../pages/public/AboutPage"
import ContactPage from "../pages/public/ContactPage"
import HowItWorksPage from "../pages/public/HowItWorksPage"

// User Area
import UserProfile from "../pages/dashboard/UserProfile"

// Seller Area
import SellerPanel from "../pages/dashboard/SellerPanel"

// Admin Area
import AdminPanel from "../pages/dashboard/AdminPanel"

export const ROUTES = [
  {
    path: "/",
    element: <PublicLayout />,
    errorElement: <GlobalError />,
    children: [
      { index: true, element: <LandingPage /> },

      // Auth — guest guard prevents logged-in users
      { path: "login", element: <GuestGuard><LoginPage /></GuestGuard> },
      { path: "register", element: <GuestGuard><RegisterPage /></GuestGuard> },
      { path: "otp", element: <GuestGuard><OTPPage /></GuestGuard> },

      // ── MARKETPLACE (commerce-first) ──
      { path: "marketplace", element: <Marketplace /> },
      { path: "product/:id", element: <ProductDetailsPage /> },
      { path: "seller/:id", element: <SellerStorefrontPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <AuthGuard><CheckoutPage /></AuthGuard> },

      // ── ENCYCLOPEDIA (knowledge-first — distinct from marketplace) ──
      { path: "herbs", element: <EncyclopediaIndexPage /> },
      { path: "herb/:id", element: <HerbDetailsPage /> },

      // ── Corporate Pages ──
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "how-it-works", element: <HowItWorksPage /> },
      { path: "ai-consultant", element: <AIConsultant /> },
    ]
  },

  // ── USER AREA ── /user/*
  {
    path: "/user",
    element: <AuthGuard allowedRoles={["MEMBER", "SELLER", "ADMIN"]}><UserLayout /></AuthGuard>,
    errorElement: <GlobalError />,
    children: [
      { index: true, element: <UserProfile tab="profile" /> },
      { path: "orders",   element: <UserProfile tab="orders" /> },
      { path: "wishlist", element: <UserProfile tab="wishlist" /> },
      { path: "settings", element: <UserProfile tab="settings" /> },
    ]
  },

  // ── SELLER AREA ── /seller/*
  {
    path: "/seller",
    element: <AuthGuard allowedRoles={["SELLER"]}><SellerLayout /></AuthGuard>,
    errorElement: <GlobalError />,
    children: [
      { index: true,          element: <SellerPanel tab="overview" /> },
      { path: "products",     element: <SellerPanel tab="products" /> },
      { path: "orders",       element: <SellerPanel tab="orders" /> },
      { path: "settings",     element: <SellerPanel tab="settings" /> },
    ]
  },

  // ── ADMIN AREA ── /admin/*
  {
    path: "/admin",
    element: <AuthGuard allowedRoles={["ADMIN"]}><AdminLayout /></AuthGuard>,
    errorElement: <GlobalError />,
    children: [
      { index: true,       element: <AdminPanel tab="overview" /> },
      { path: "users",     element: <AdminPanel tab="users" /> },
      { path: "products",  element: <AdminPanel tab="products" /> },
      { path: "plants",    element: <AdminPanel tab="plants" /> },
      { path: "categories",element: <AdminPanel tab="categories" /> },
    ]
  }
]