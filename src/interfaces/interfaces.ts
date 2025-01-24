import { Item, NewItemModel } from "../types/types";

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

export interface ItemNewFormProps {
    open: boolean
    itemData?: NewItemModel
    onClose: (value?: NewItemModel) => void
}
