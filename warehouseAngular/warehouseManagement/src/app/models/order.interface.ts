import { OrderItem } from "./orderItem.inteface";
import { User } from "./user.interface";

export interface Order {
  id: number;
  orderNumber: string;
  submittedDate: string;
  status: string;
  deadlineDate: string;
  declineReason?: string;
  client: User;
  orderItems: OrderItem[];
}
