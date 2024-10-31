import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma, Customer } from '@prisma/client';
import { createCustomError } from '../common/utils/response-handler';

describe('CustomerService', () => {
  let service: CustomerService;
  let prismaService: PrismaService;

  const mockCustomer: Customer = {
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

  const mockCustomerData: Prisma.CustomerCreateInput = {
    name: 'John Doe',
    phone: '924390912',
  };

  const mockNotFoundError = (id: string) =>
    createCustomError(`Customer with ID ${id} not found`, HttpStatus.NOT_FOUND);

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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer successfully', async () => {
      jest
        .spyOn(prismaService.customer, 'create')
        .mockResolvedValue(mockCustomer);

      await expect(service.create(mockCustomerData)).resolves.toEqual(
        mockCustomer,
      );

      expect(prismaService.customer.create).toHaveBeenCalledWith(
        mockCustomerData,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated customers', async () => {
      const customers: Customer[] = [mockCustomer];
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

      expect(prismaService.customer.findMany).toHaveBeenCalledWith({
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
      });
      expect(prismaService.customer.count).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a customer by ID', async () => {
      jest
        .spyOn(prismaService.customer, 'findUniqueOrThrow')
        .mockResolvedValue(mockCustomer);

      await expect(service.findOne({ id: '1' })).resolves.toEqual(mockCustomer);
    });

    it('should throw a NotFound error if customer does not exist', async () => {
      jest
        .spyOn(prismaService.customer, 'findUniqueOrThrow')
        .mockImplementation(() => {
          throw mockNotFoundError('1');
        });

      await expect(service.findOne({ id: '1' })).rejects.toThrow(HttpException);
      await expect(service.findOne({ id: '1' })).rejects.toThrowError(
        new HttpException('Customer with ID 1 not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('update', () => {
    it('should update a customer successfully', async () => {
      jest
        .spyOn(prismaService.customer, 'update')
        .mockResolvedValue(mockCustomer);

      await expect(
        service.update({ id: '1' }, { name: 'John Doe Updated' }),
      ).resolves.toEqual(mockCustomer);
    });

    it('should throw a NotFound error if customer does not exist', async () => {
      jest
        .spyOn(prismaService.customer, 'findUniqueOrThrow')
        .mockImplementation(() => {
          throw mockNotFoundError('1');
        });

      await expect(service.findOne({ id: '1' })).rejects.toThrow(HttpException);
      await expect(service.findOne({ id: '1' })).rejects.toThrowError(
        new HttpException('Customer with ID 1 not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('remove', () => {
    it('should delete a customer successfully', async () => {
      jest
        .spyOn(prismaService.customer, 'delete')
        .mockResolvedValue(mockCustomer);

      await expect(service.remove({ id: '1' })).resolves.toEqual(mockCustomer);
      expect(prismaService.customer.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw a NotFound error if customer does not exist', async () => {
      jest
        .spyOn(prismaService.customer, 'findUniqueOrThrow')
        .mockImplementation(() => {
          throw mockNotFoundError('1');
        });

      await expect(service.findOne({ id: '1' })).rejects.toThrow(HttpException);
      await expect(service.findOne({ id: '1' })).rejects.toThrowError(
        new HttpException('Customer with ID 1 not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});
