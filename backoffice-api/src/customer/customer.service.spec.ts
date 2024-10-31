import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma, Customer } from '@prisma/client';
import { createCustomError } from '../common/utils/response-handler';

describe('CustomerService', () => {
  let service: CustomerService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: PrismaService,
          useValue: {
            customer: {
              create: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a customer successfully', async () => {
      const customerData: Prisma.CustomerCreateInput = {
        name: 'John Doe',
        phone: '924390912',
      };

      const createdCustomer: Customer = {
        id: '1',
        name: 'John Doe',
        phone: '924390912',
        bi: '123456789',
        genre: 'male',
        address: '123 Main St',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.customer, 'create')
        .mockResolvedValue(createdCustomer);

      await expect(service.create(customerData)).resolves.toEqual(
        createdCustomer,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated customers', async () => {
      const customers: Customer[] = [
        {
          id: '1',
          name: 'John Doe',
          phone: '924390912',
          bi: '123456789',
          genre: 'male',
          address: '123 Main St',
          email: 'john@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const totalCount = 10;
      const pageNumber = 1;
      const limitNumber = 10;

      jest
        .spyOn(prismaService.customer, 'findMany')
        .mockResolvedValue(customers);
      jest.spyOn(prismaService.customer, 'count').mockResolvedValue(totalCount);

      const result = await service.findAll(pageNumber, limitNumber);

      expect(result).toEqual({
        customers,
        totalCount,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
      });
    });
  });

  describe('findOne', () => {
    it('should return a customer by ID', async () => {
      const customer: Customer = {
        id: '1',
        name: 'John Doe',
        phone: '924390912',
        bi: '123456789',
        genre: 'male',
        address: '123 Main St',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.customer, 'findUniqueOrThrow')
        .mockResolvedValue(customer);

      await expect(service.findOne({ id: '1' })).resolves.toEqual(customer);
    });

    it('should throw a NotFound error if customer does not exist', async () => {
      const nonExistentId = { id: '1' };

      // Simula o lançamento de uma exceção
      jest
        .spyOn(prismaService.customer, 'findUniqueOrThrow')
        .mockImplementation(() => {
          throw createCustomError(
            `Customer with ID ${nonExistentId.id} not found`,
            HttpStatus.NOT_FOUND,
          );
        });

      await expect(service.findOne(nonExistentId)).rejects.toThrow(
        HttpException,
      );
      await expect(service.findOne(nonExistentId)).rejects.toThrowError(
        new HttpException(
          `Customer with ID ${nonExistentId.id} not found`,
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('update', () => {
    it('should update a customer successfully', async () => {
      const customer: Customer = {
        id: '1',
        name: 'John Doe',
        phone: '924390912',
        bi: '123456789',
        genre: 'male',
        address: '123 Main St',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updateData: Prisma.CustomerUpdateInput = {
        name: 'John Doe Updated',
      };

      jest.spyOn(prismaService.customer, 'update').mockResolvedValue(customer);

      await expect(service.update({ id: '1' }, updateData)).resolves.toEqual(
        customer,
      );
    });

    it('should throw a NotFound error if customer does not exist', async () => {
      const nonExistentId = { id: '1' };

      // Simula o lançamento de uma exceção
      jest
        .spyOn(prismaService.customer, 'findUniqueOrThrow')
        .mockImplementation(() => {
          throw createCustomError(
            `Customer with ID ${nonExistentId.id} not found`,
            HttpStatus.NOT_FOUND,
          );
        });

      await expect(service.findOne(nonExistentId)).rejects.toThrow(
        HttpException,
      );
      await expect(service.findOne(nonExistentId)).rejects.toThrowError(
        new HttpException(
          `Customer with ID ${nonExistentId.id} not found`,
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('remove', () => {
    it('should delete a customer successfully', async () => {
      const customer: Customer = {
        id: '1',
        name: 'John Doe',
        phone: '924390912',
        bi: '123456789',
        genre: 'male',
        address: '123 Main St',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.customer, 'delete').mockResolvedValue(customer);

      await expect(service.remove({ id: '1' })).resolves.toEqual(customer);
    });

    it('should throw a NotFound error if customer does not exist', async () => {
      const nonExistentId = { id: '1' };

      // Simula o lançamento de uma exceção
      jest
        .spyOn(prismaService.customer, 'findUniqueOrThrow')
        .mockImplementation(() => {
          throw createCustomError(
            `Customer with ID ${nonExistentId.id} not found`,
            HttpStatus.NOT_FOUND,
          );
        });

      await expect(service.findOne(nonExistentId)).rejects.toThrow(
        HttpException,
      );
      await expect(service.findOne(nonExistentId)).rejects.toThrowError(
        new HttpException(
          `Customer with ID ${nonExistentId.id} not found`,
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });
});
