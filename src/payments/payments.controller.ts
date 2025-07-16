import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaymentsService } from './payments.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { OrderStatus } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Roles('CUSTOMER')
  @Post()
  create(@Body() dto: CreatePaymentDto, @CurrentUser() user: any) {
    return this.paymentsService.create(dto, user.id);
  }

  @Roles('CUSTOMER')
  @Get('my')
  findMyPayments(@CurrentUser() user: any) {
    return this.paymentsService.findMyPayments(user.id);
  }

  @Roles('ADMIN')
  @Get('my')
  findAll() {
    return this.paymentsService.findAll();
  }

  @Roles('ADMIN')
  @Patch(":id/confirm")
  confirm(@Param('id') id: string) {
    return this.paymentsService.confirmPayment(id);
  }
}
