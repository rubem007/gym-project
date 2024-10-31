// update-customer.dto.spec.ts
import { validate } from 'class-validator';
import { UpdateCustomerDto } from './update-customer.dto';

describe('UpdateCustomerDto', () => {
  it('deve validar um objeto vazio, pois todos os campos são opcionais', async () => {
    const dto = new UpdateCustomerDto();

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('deve validar corretamente quando alguns campos estão preenchidos', async () => {
    const dto = new UpdateCustomerDto();
    dto.name = 'John Doe';
    dto.phone = '1234567890';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('deve falhar quando o campo name não for string', async () => {
    const dto = new UpdateCustomerDto();
    dto.name = 123 as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('deve falhar quando o campo phone não for string', async () => {
    const dto = new UpdateCustomerDto();
    dto.phone = 9876543210 as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('phone');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('deve validar corretamente os campos opcionais (bi, genre, address, email) quando são strings', async () => {
    const dto = new UpdateCustomerDto();
    dto.bi = '123456789';
    dto.genre = 'Male';
    dto.address = '123 Main St';
    dto.email = 'john@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('deve falhar se qualquer campo opcional (bi, genre, address, email) não for string', async () => {
    const dto = new UpdateCustomerDto();
    dto.bi = 12345 as any;
    dto.genre = true as any;
    dto.address = {} as any;
    dto.email = [] as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.map((e) => e.property)).toEqual(
      expect.arrayContaining(['bi', 'genre', 'address', 'email']),
    );
  });
});
