import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto, UpdateAddressDto } from './dto';
import { ClerkGuard } from '../auth/clerk.guard';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @UseGuards(ClerkGuard)
  async createAddress(@Body() createAddressDto: CreateAddressDto, @Request() req: any) {
    const userId = req.user.id;
    return await this.addressService.createAddress(userId, createAddressDto);
  }

  @Get()
  @UseGuards(ClerkGuard)
  async getUserAddresses(@Request() req: any) {
    const userId = req.user.id;
    return await this.addressService.getUserAddresses(userId);
  }

  @Get(':id')
  @UseGuards(ClerkGuard)
  async getAddress(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;
    return await this.addressService.getAddress(id, userId);
  }

  @Put(':id')
  @UseGuards(ClerkGuard)
  async updateAddress(
    @Param('id') id: string, 
    @Body() updateAddressDto: UpdateAddressDto, 
    @Request() req: any
  ) {
    const userId = req.user.id;
    return await this.addressService.updateAddress(id, userId, updateAddressDto);
  }

  @Delete(':id')
  @UseGuards(ClerkGuard)
  async deleteAddress(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;
    return await this.addressService.deleteAddress(id, userId);
  }

  @Put(':id/set-default')
  @UseGuards(ClerkGuard)
  async setDefaultAddress(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;
    return await this.addressService.setDefaultAddress(id, userId);
  }
}
