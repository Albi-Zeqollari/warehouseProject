import { Item } from "./item.interface";
import { Order } from "./order.interface";

export interface OrderItem {
  id: number;
  order: Order;   // Associated Order
  item: Item;     // Associated Item
  requestedQuantity: number;
}
