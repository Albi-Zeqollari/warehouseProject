import { OrderStatus } from '../orderStatus.enum';
import { User } from '../user.interface';
import { OrderItemDto } from './OrderItemDto';

export class OrderDto {
  submittedDate: string | undefined;
  status!: OrderStatus;
  deadlineDate: string | undefined;
  orderItems: OrderItemDto[] | undefined;
  client!: User;
  declineReason: string | null | undefined;
}
