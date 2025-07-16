import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DashboardService } from './dashboard.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get('stats')
    getStats() {
        return this.dashboardService.getStats();
    }

    @Get('recent-orders')
    getRecentOrders() {
        return this.dashboardService.getRecentOrders();
    }
}
