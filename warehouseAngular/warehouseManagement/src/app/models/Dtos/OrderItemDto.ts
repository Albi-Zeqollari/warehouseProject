import { ItemDto } from "./ItemDto";

export class OrderItemDto {

  item:ItemDto | undefined
  requestedQuantity!: number;
}
