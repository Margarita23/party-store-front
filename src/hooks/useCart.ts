import { useEffect, useState } from "react";
import { Item } from "../models/Item.ts";

const saveItems = (items: Record<number, { item: Item; quantity: number }>) => {
  localStorage.setItem("items", JSON.stringify(items));
};

export const useCart = () => {
  const [items, setItems] = useState<Record<number, { item: Item; quantity: number }>>({});

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem("items");
      const parsedItems = storedItems ? JSON.parse(storedItems) : {};
      setItems(parsedItems);
    } catch (error) {
      console.error("Failed to load items from localStorage", error);
    }
  }, []);

  const totalPrice = () => {
    return Object.values(items).reduce((total, { item, quantity }) => {
      return total + item.price * quantity;
    }, 0);
  };

  // const totalPrice = useMemo(() => {
  //   return Object.values(items).reduce(
  //     (sum, { item, quantity }) => sum + item.price * quantity,
  //       0
  //   	);
  //   }, [items]);

  const addToCart = (item: Item, quantity: number) => {
    setItems((prevItems) => {
      const existingItem = prevItems[item.id];
      const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;
      const updatedItems = {
        ...prevItems,
        [item.id]: { item: item, quantity: newQuantity },
      };
      saveItems(updatedItems);
      return updatedItems;
    });
  };

  const removeFromCart = (itemId: number) => {
    setItems((prevItems) => {
      const { [itemId]: _, ...rest } = prevItems;
      saveItems(rest);
      return rest;
    });
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    setItems((prevItems) => {
      if (quantity <= 0) {
        const { [itemId]: _, ...rest } = prevItems;
        saveItems(rest);
        return rest;
      }
      const updatedItems = {
        ...prevItems,
        [itemId]: { ...prevItems[itemId], quantity },
      };
      saveItems(updatedItems);
      return updatedItems;
    });
  };

  const clearCart = () => {
    setItems({});
    saveItems({});
  };

  return {
    items,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
};
