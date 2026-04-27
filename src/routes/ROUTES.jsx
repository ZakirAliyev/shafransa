import React from "react"
import { Navigate } from "react-router-dom"

import PublicLayout from "../components/layout/PublicLayout"
import UserLayout from "../components/layout/UserLayout"
import SellerLayout from "../components/layout/SellerLayout"
import AdminLayout from "../components/layout/AdminLayout"

import LandingPage from "../pages/public/LandingPage"
import LoginPage from "../pages/auth/LoginPage"
import RegisterPage from "../pages/auth/RegisterPage"
import OTPPage from "../pages/auth/OTPPage"

import TherapistListingPage from "../pages/public/TherapistListingPage"
import TherapistDetailPage from "../pages/public/TherapistDetailPage"
import TherapistRegisterPage from "../pages/public/TherapistRegisterPage"

import BlogListingPage from "../pages/public/BlogListingPage"
import BlogDetailPage from "../pages/public/BlogDetailPage"

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
import AIConsultantPage from "../pages/dashboard/AIConsultant"

// User Area
import UserProfile from "../pages/dashboard/UserProfile"

// Seller Area
import SellerPanel from "../pages/dashboard/SellerPanel"

// Admin Area
import AdminPanel from "../pages/dashboard/AdminPanel"

// Expert Area
import ExpertPanel from "../pages/dashboard/ExpertPanel"

export const ROUTES = [
  {
    path: "/",
    element: <PublicLayout />,
    errorElement: <GlobalError />,
    children: [
      { index: true, element: <LandingPage /> },

      // Auth — no guard, freely accessible
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "otp", element: <OTPPage /> },

      // ── MARKETPLACE (commerce-first) ──
      { path: "marketplace", element: <Marketplace /> },
      { path: "product/:id", element: <ProductDetailsPage /> },
      { path: "seller/:id", element: <SellerStorefrontPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },

      // ── ENCYCLOPEDIA (knowledge-first — distinct from marketplace) ──
      { path: "herbs", element: <EncyclopediaIndexPage /> },
      { path: "herb/:id", element: <HerbDetailsPage /> },

      // ── Corporate Pages ──
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "how-it-works", element: <HowItWorksPage /> },
      { path: "ai-consultant", element: <AIConsultant /> },
      
      // ── THERAPISTS ──
      { path: "therapists", element: <TherapistListingPage /> },
      { path: "therapist/:id", element: <TherapistDetailPage /> },
      { path: "register-therapist", element: <TherapistRegisterPage /> },

      // ── BLOG ──
      { path: "blogs", element: <BlogListingPage /> },
      { path: "blog/:id", element: <BlogDetailPage /> },
    ]
  },

  // ── USER AREA ── /user/*
  {
    path: "/user",
    element: <UserLayout />,
    errorElement: <GlobalError />,
    children: [
      { index: true, element: <UserProfile tab="profile" /> },
      { path: "orders",   element: <UserProfile tab="orders" /> },
      { path: "wishlist", element: <UserProfile tab="wishlist" /> },
      { path: "sessions", element: <UserProfile tab="sessions" /> },
      { path: "settings", element: <UserProfile tab="settings" /> },
    ]
  },

  // ── SELLER AREA ── /seller/*
  {
    path: "/seller",
    element: <SellerLayout />,
    errorElement: <GlobalError />,
    children: [
      { index: true,          element: <SellerPanel tab="overview" /> },
      { path: "products",     element: <SellerPanel tab="products" /> },
      { path: "orders",       element: <SellerPanel tab="orders" /> },
      { path: "settings",     element: <SellerPanel tab="settings" /> },
    ]
  },

  // ── EXPERT AREA ── /expert/*
  {
    path: "/expert",
    element: <UserLayout />, 
    errorElement: <GlobalError />,
    children: [
      { index: true, element: <ExpertPanel /> },
    ]
  },

  // ── ADMIN AREA ── /admin/*
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <GlobalError />,
    children: [
      { index: true,       element: <AdminPanel tab="overview" /> },
      { path: "users",     element: <AdminPanel tab="users" /> },
      { path: "products",  element: <AdminPanel tab="products" /> },
      { path: "plants",    element: <AdminPanel tab="plants" /> },
      { path: "categories",element: <AdminPanel tab="categories" /> },
      { path: "therapists",element: <AdminPanel tab="therapists" /> },
      { path: "sessions",  element: <AdminPanel tab="sessions" /> },
    ]
  },

  // ── REDIRECTS & COMPATIBILITY ──
  { path: "/cp/home", element: <Navigate to="/user" replace /> },
  { path: "/cp/*", element: <Navigate to="/" replace /> },
  { path: "/user/me", element: <Navigate to="/user" replace /> },
  { path: "/me", element: <Navigate to="/user" replace /> },
  { path: "/auth/login", element: <Navigate to="/login" replace /> }
]