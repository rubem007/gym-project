import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Customer } from '@prisma/client';
import { createCustomError } from 'src/common/utils/respose-handler';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CustomerCreateInput): Promise<Customer> {
    return this.prisma.customer.create({
      data,
    });
  }

  async findAll(
    pageNumber: number,
    limitNumber: number,
  ): Promise<{
    customers: Customer[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const skip = (pageNumber - 1) * limitNumber;

    const customers = await this.prisma.customer.findMany({
      skip,
      take: limitNumber,
    });

    const totalCount = await this.prisma.customer.count();

    return {
      customers,
      totalCount,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCount / limitNumber),
    };
  }

  async findOne(id: Prisma.CustomerWhereUniqueInput): Promise<Customer> {
    try {
      const findCustomer = await this.prisma.customer.findUniqueOrThrow({
        where: id,
      });

      return findCustomer;
    } catch (error) {
      throw createCustomError(
        `Customer with ID ${id.id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async update(
    id: Prisma.CustomerWhereUniqueInput,
    data: Prisma.CustomerUpdateInput,
  ): Promise<Customer> {
    try {
      const updateCustomer = await this.prisma.customer.update({
        where: id,
        data,
      });

      return updateCustomer;
    } catch (error) {
      throw createCustomError(
        `Customer with ID ${id.id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async remove(id: Prisma.CustomerWhereUniqueInput): Promise<Customer> {
    try {
      const deleteCostumer = await this.prisma.customer.delete({
        where: id,
      });

      return deleteCostumer;
    } catch (error) {
      throw createCustomError(
        `Customer with ID ${id.id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
