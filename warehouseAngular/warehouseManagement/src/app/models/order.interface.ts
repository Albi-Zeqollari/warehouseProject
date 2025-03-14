import { OrderItem } from "./orderItem.inteface";
import { OrderStatus } from "./orderStatus.enum";
import { User } from "./user.interface";

export interface Order {
  id: number;
  orderNumber: string;
  submittedDate: string; // ISO date string, e.g., "2025-03-13T12:00:00Z"
  status: string;
  deadlineDate: string;  // ISO date string, e.g., "2025-03-20"
  declineReason?: string; // optional if it can be null
  client: User;
  orderItems: OrderItem[];
}
