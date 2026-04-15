import api from "./api";
import { MOCK_MARKET_PRODUCTS } from "./mockData";

const LOCAL_CART_KEY = "shafransa_local_cart";

const readLocalCartItems = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_CART_KEY) || "[]");
  } catch {
    return [];
  }
};

const writeLocalCartItems = (items) => {
  try {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage failures; backend cart can still work.
  }
};

const getLocalCart = () => ({ items: readLocalCartItems() });

const mergeLocalCart = (cart) => {
  const remoteCart = cart?.data || cart || {};
  const remoteItems = Array.isArray(remoteCart.items) ? remoteCart.items : [];
  const localItems = readLocalCartItems();
  const remoteIds = new Set(remoteItems.map((item) => item.id));

  return {
    ...remoteCart,
    items: [...localItems.filter((item) => !remoteIds.has(item.id)), ...remoteItems],
  };
};

export const getCart = async () => {
  try {
    return mergeLocalCart(await api.get("/cart"));
  } catch (error) {
    console.warn("⚠️ Using local cart data (API failed)", error?.message);
    return getLocalCart();
  }
};

export const addToCart = async (productId, quantity) => {
  const seedProduct = MOCK_MARKET_PRODUCTS.find((product) => product.id === productId);

  if (seedProduct) {
    const items = readLocalCartItems();
    const existing = items.find((item) => item.product?.id === productId);

    if (existing) {
      existing.quantity += quantity;
      writeLocalCartItems(items);
      return getLocalCart();
    }

    writeLocalCartItems([
      {
        id: `local-cart-${productId}`,
        quantity,
        product: seedProduct,
      },
      ...items,
    ]);
    return getLocalCart();
  }

  try {
    return await api.post("/cart/add", { productId, quantity });
  } catch (error) {
    console.warn("⚠️ Add to cart failed", error?.message);
    throw error;
  }
};

export const updateCartItem = async (id, quantity) => {
  if (String(id).startsWith("local-cart-")) {
    const items = readLocalCartItems().map((item) => item.id === id ? { ...item, quantity } : item);
    writeLocalCartItems(items);
    return getLocalCart();
  }

  return await api.put(`/cart/${id}`, { quantity });
};

export const removeFromCart = async (id) => {
  if (String(id).startsWith("local-cart-")) {
    writeLocalCartItems(readLocalCartItems().filter((item) => item.id !== id));
    return getLocalCart();
  }

  return await api.delete(`/cart/${id}`);
};
