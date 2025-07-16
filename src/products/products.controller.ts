import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ProductsService } from './products.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService){}

    @Roles('ADMIN')
    @Post()
    create(@Body() dto: CreateProductDto){
        return this.productsService.create(dto)
    }

    @Get()
    findAll(@Query() query: any) {
        return this.productsService.findAll(query);
    }

    @Get(":id")
    findByOne(@Param('id') id:string) {
        return this.productsService.findOne(id)
    }

    @Roles('ADMIN')
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateProductDto){
        return this.productsService.update(id, dto)
    }

    @Roles('ADMIN')
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productsService.remove(id)
    }
}
