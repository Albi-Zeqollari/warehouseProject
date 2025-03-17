
import { User } from '../user.interface';
import { OrderItemDto } from './OrderItemDto';

export class OrderDto {
  submittedDate: string | undefined;
  status!: string;
  deadlineDate: string | undefined;
  orderItems: OrderItemDto[] | undefined;
  client!: User;
  declineReason: string | null | undefined;
}
