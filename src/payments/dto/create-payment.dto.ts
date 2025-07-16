import { IsNumber, IsUUID } from "class-validator";

export class CreatePaymentDto {
    @IsUUID()
    orderId: string;

    @IsNumber()
    amount: number;
}