import { Item } from "../models/Item";

export interface CartItem {
    item: Item;
    quantity: number;
}

export interface Props {
    amount: number
}

export interface CartProps {
    [productId: string]: Item
}

export interface PropsWidget {
    itemsCount: number
}
