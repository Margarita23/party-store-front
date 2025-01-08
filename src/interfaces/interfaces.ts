import { Item } from "../models/Item";

export interface CartItem {
    item: Item;
    quantity: number;
}
  
export interface CartContextType {
    items: CartItem[];
    addToCart: (item: Item, quantity: number) => void;
    removeFromCart: (item: Item) => void;
  }

export interface CartItemProps {
    item: CartItem;
}
