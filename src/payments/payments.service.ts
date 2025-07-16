import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreatePaymentDto, userId: string) {
    return this.prisma.payment.create({
      data: {
        amount: dto.amount,
        orderId: dto.orderId,
        userId,
      },
    });
  }

  findMyPayments(userId: string) {
    return this.prisma.payment.findMany({
      where: {
        userId,
      },
      include: {
        order: true,
      },
    });
  }

  findAll() {
    return this.prisma.payment.findMany({
      include: {
        user: true,
        order: true,
      },
    });
  }

  confirmPayment(id: string) {
    return this.prisma.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.CONFIRMED
      },
    });
  }
}
