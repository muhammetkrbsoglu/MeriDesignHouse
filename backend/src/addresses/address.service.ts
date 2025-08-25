import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateAddressDto, UpdateAddressDto } from './dto';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async createAddress(userId: string, createAddressDto: CreateAddressDto) {
    const { title, firstName, lastName, addressLine1, addressLine2, city, state, postalCode, country, phoneNumber, isDefault } = createAddressDto;

    // If this is the first address, make it default
    const existingAddresses = await this.prisma.address.findMany({
      where: { userId }
    });

    const shouldBeDefault = isDefault || existingAddresses.length === 0;

    // If setting as default, unset other default addresses
    if (shouldBeDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false }
      });
    }

    const address = await this.prisma.address.create({
      data: {
        userId,
        title,
        firstName,
        lastName,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country: country || 'Türkiye',
        phoneNumber,
        isDefault: shouldBeDefault
      }
    });

    return address;
  }

  async getUserAddresses(userId: string) {
    return await this.prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });
  }

  async getAddress(id: string, userId: string) {
    const address = await this.prisma.address.findFirst({
      where: { id, userId }
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return address;
  }

  async updateAddress(id: string, userId: string, updateAddressDto: UpdateAddressDto) {
    const address = await this.getAddress(id, userId);
    const { isDefault, ...updateData } = updateAddressDto;

    // If setting as default, unset other default addresses
    if (isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false }
      });
    }

    const updatedAddress = await this.prisma.address.update({
      where: { id },
      data: updateData
    });

    return updatedAddress;
  }

  async deleteAddress(id: string, userId: string) {
    const address = await this.getAddress(id, userId);

    // Check if address is used in any orders
    const ordersUsingAddress = await this.prisma.order.findFirst({
      where: {
        OR: [
          { shippingAddressId: id },
          { billingAddressId: id }
        ]
      }
    });

    if (ordersUsingAddress) {
      throw new BadRequestException('Cannot delete address that is used in orders');
    }

    await this.prisma.address.delete({
      where: { id }
    });

    // If this was the default address, set another address as default
    if (address.isDefault) {
      const remainingAddresses = await this.prisma.address.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      if (remainingAddresses.length > 0) {
        await this.prisma.address.update({
          where: { id: remainingAddresses[0].id },
          data: { isDefault: true }
        });
      }
    }

    return { message: 'Address deleted successfully' };
  }

  async setDefaultAddress(id: string, userId: string) {
    const address = await this.getAddress(id, userId);

    // Unset all other default addresses
    await this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false }
    });

    // Set this address as default
    const updatedAddress = await this.prisma.address.update({
      where: { id },
      data: { isDefault: true }
    });

    return updatedAddress;
  }
}
