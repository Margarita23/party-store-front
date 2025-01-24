export type Operation = 'decrease' | 'increase'

export type Item = {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
}

export type NewItemModel = {
    id?: number;
    name: string;
    description: string;
    price: number;
}

export type NewItemModelErrors = {
    name: string;
    description: string;
    price: string;
}

export type Order = {
    id: number;
    amount: number;
}

export type OrderDetails = {
    id: number;
    amount: number;
    items: OrdersItem[];
}

export type OrdersItem = {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
}

export type User = {
    id?: number;
    first_name: string;
    last_name?: string;
    email: string;
    role: "user" | "admin"
}

