import { Request, Response } from 'express';
import { UsersController } from './users.controller';

const mockRepo = {
  getAll: jest.fn().mockResolvedValue([{}]),
  getById: jest.fn().mockResolvedValue({}),
  search: jest.fn().mockResolvedValue([{}]),

  create: jest.fn().mockResolvedValue({}),
  login: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({}),
  addFriend: jest.fn().mockResolvedValue({}),
  addEnemy: jest.fn().mockResolvedValue({}),
  removeFriend: jest.fn().mockResolvedValue({}),
  removeEnemy: jest.fn().mockResolvedValue({}),
};
describe('Given FilmssController class', () => {
  let controller: UsersController;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
    } as Request;
    mockResponse = {
      json: jest.fn(),
    } as unknown as Response;
    mockNext = jest.fn();
  });
  describe('When we instantiate it without errors', () => {
    beforeEach(() => {
      controller = new UsersController(mockRepo);
    });

    test('Then getAll should ...', async () => {
      await controller.getAll(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith([{}]);
    });

    test('Then getById should ...', async () => {
      await controller.getById(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });
  });
});
