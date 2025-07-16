import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto, userId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const itemsData = await Promise.all(
        dto.items.map(async (item) => {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
          });
          if (!product) throw new NotFoundException(`Product not found`);
          if (product.stock < item.quantity)
            throw new BadRequestException(
              `Not enough stock for ${product.name}`,
            );

          await prisma.product.update({
            where: { id: product.id },
            data: { stock: product.stock - item.quantity },
          });

          return {
            productId: product.id,
            quantity: item.quantity,
            unitPrice: product.price,
          };
        }),
      );

      const totalAmount = itemsData.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      );

      return prisma.order.create({
        data: {
          userId,
          totalAmount,
          items: { create: itemsData },
        },
        include: { items: true },
      });
    });
  }

  async findMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  updateStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: {
        status
      },
    });
  }

  async cancelOrder(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    if (!order) throw new NotFoundException('Order not found');

    if (order.userId !== userId) throw new ForbiddenException('Access denied');

    if (order.status !== 'PENDING')
      throw new BadRequestException('Cannot cancel processed order');

    return this.prisma.order.update({
      where: {
        id,
      },
      data: {
        status: 'CANCELLED'
      },
    });
  }

  async adminUpdatedStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: {
        status,
      },
    });
  }
}
