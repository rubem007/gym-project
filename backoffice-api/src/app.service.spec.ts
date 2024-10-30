import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of users', () => {
    const result = service.findAll();
    expect(result).toEqual([{ id: 1, name: 'User 1' }]);
  });

  it('should return an empty array if no users are present', () => {
    // Simulando um cenário onde não há usuários
    service['users'] = [];
    const result = service.findAll();
    expect(result).toEqual([]);
  });
});
