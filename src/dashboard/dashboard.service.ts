import { Get, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  @Get('stats')
  async getStats() {
    const usersCount = await this.prisma.user.count();
    const productsCount = await this.prisma.product.count();
    const ordersCount = await this.prisma.order.count();
    const paymentsCount = await this.prisma.payment.count();

    const revenue = await this.prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'CONFIRMED' },
    });

    return {
      usersCount,
      paymentsCount,
      ordersCount,
      productsCount,
      revenue: revenue._sum || 0,
    };
  }

  async getRecentOrders(limit = 5) {
    return this.prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      include: {
        user: true,
        items: {
            include: {
                product: true
            }
        }
      }
    });
  }
}
