import React, { createContext, useContext, useReducer, useMemo } from "react";

const CartContext = createContext(null);

const getDishId = (dish) => String(dish?._id || dish?.id || "");

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const targetId = getDishId(action.payload.dish);
      const existing = state.items.find(
        (item) => getDishId(item.dish) === targetId
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            getDishId(item.dish) === targetId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            dish: action.payload.dish,
            quantity: 1,
            restaurantId: action.payload.restaurantId,
            restaurantName: action.payload.restaurantName,
          },
        ],
      };
    }

    case "REMOVE_ITEM": {
      const targetId = String(action.payload.dishId || "");
      const existing = state.items.find(
        (item) => getDishId(item.dish) === targetId
      );
      if (existing && existing.quantity > 1) {
        return {
          ...state,
          items: state.items.map((item) =>
            getDishId(item.dish) === targetId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: state.items.filter(
          (item) => getDishId(item.dish) !== targetId
        ),
      };
    }

    case "UPDATE_QUANTITY": {
      const targetId = String(action.payload.dishId || "");
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => getDishId(item.dish) !== targetId
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          getDishId(item.dish) === targetId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "PLACE_ORDER": {
      const order = {
        id: `BB-${Date.now().toString(36).toUpperCase()}`,
        items: [...state.items],
        total: state.items.reduce(
          (sum, item) => sum + item.dish.price * item.quantity,
          0
        ),
        placedAt: new Date().toISOString(),
        status: "confirmed",
        estimatedDelivery: "30-40 mins",
      };
      return {
        ...state,
        items: [],
        orders: [order, ...state.orders],
      };
    }

    default:
      return state;
  }
};

const initialState = {
  items: [],
  orders: [],
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const totalItems = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items]
  );

  const totalPrice = useMemo(
    () =>
      state.items.reduce(
        (sum, item) => sum + item.dish.price * item.quantity,
        0
      ),
    [state.items]
  );

  const getItemQuantity = (dishId) => {
    const targetId = String(dishId || "");
    const item = state.items.find((item) => getDishId(item.dish) === targetId);
    return item ? item.quantity : 0;
  };

  const addItem = (dish, restaurantId, restaurantName) => {
    dispatch({
      type: "ADD_ITEM",
      payload: { dish, restaurantId, restaurantName },
    });
  };

  const removeItem = (dishId) => {
    dispatch({ type: "REMOVE_ITEM", payload: { dishId } });
  };

  const updateQuantity = (dishId, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { dishId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const placeOrder = () => {
    dispatch({ type: "PLACE_ORDER" });
  };

  const value = {
    items: state.items,
    orders: state.orders,
    totalItems,
    totalPrice,
    getItemQuantity,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    placeOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export default CartContext;
