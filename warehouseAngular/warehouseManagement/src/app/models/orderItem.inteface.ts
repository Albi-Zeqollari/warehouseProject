import { Item } from "./item.interface";
import { Order } from "./order.interface";

export interface OrderItem {
  id: number;
  order: Order;
  item: Item;
  requestedQuantity: number;
}
