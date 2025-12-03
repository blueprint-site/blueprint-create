// tests/main.test.js

jest.mock('../src/utils/config.js', () => ({
  config: {
    apiKey: 'mock-api-key',
    projectId: 'mock-project-id',
    adminTeamId: 'mock-admin-team-id',
    betaTesterTeamId: 'mock-beta-tester-id',
    endpoint: 'mock-endpoint',
    MEMBERSHIP_REDIRECT_URL: 'https://example.com',
  },
}));

import mainHandler from '../src/main.js';
import { authorizeRequest } from '../src/handlers/authHandler.js';
import {
  parseAndValidateRequest,
  routeAndExecuteAction,
  handleErrorResponse,
} from '../src/handlers/requestHandler.js';

// Mock dependencies
jest.mock('../src/handlers/authHandler.js');
jest.mock('../src/handlers/requestHandler.js');

describe('Main Handler', () => {
  let mockRequest;
  let mockResponse;
  let mockLog;
  let mockError;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup mock request and response objects
    mockRequest = {
      headers: { 'x-appwrite-user-id': 'test-user-id' },
      method: 'POST',
      path: '/test',
      body: { action: 'testAction', payload: {} },
    };

    mockResponse = {
      json: jest.fn().mockReturnThis(),
    };

    mockLog = jest.fn();
    mockError = jest.fn();

    // Default mock implementation
    parseAndValidateRequest.mockReturnValue({
      action: 'testAction',
      payload: {},
    });

    routeAndExecuteAction.mockResolvedValue({ result: 'success' });
    handleErrorResponse.mockReturnValue({ success: false });
  });

  test('successful execution path works as expected', async () => {
    authorizeRequest.mockResolvedValue();

    await mainHandler({
      req: mockRequest,
      res: mockResponse,
      log: mockLog,
      error: mockError,
    });

    // Verify normal flow
    expect(authorizeRequest).toHaveBeenCalledWith('test-user-id');
    expect(parseAndValidateRequest).toHaveBeenCalledWith(mockRequest);
    expect(routeAndExecuteAction).toHaveBeenCalled();
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      data: { result: 'success' },
    });
  });

  test('handles error during authorization with defined action value', async () => {
    // Make authorization throw an error
    const authError = new Error('Authorization failed');
    authorizeRequest.mockRejectedValue(authError);

    await mainHandler({
      req: mockRequest,
      res: mockResponse,
      log: mockLog,
      error: mockError,
    });

    // Verify error handling received a defined action value
    expect(handleErrorResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        e: authError,
        action: 'unknown', // This should be the default value
        res: mockResponse,
        errorLogger: mockError,
        start: expect.any(Number),
      })
    );

    // Verify parseAndValidateRequest was not called (error happened before)
    expect(parseAndValidateRequest).not.toHaveBeenCalled();
  });

  test('handles error during request parsing with defined action value', async () => {
    // Auth passes but parsing fails
    authorizeRequest.mockResolvedValue();
    const parseError = new Error('Invalid request');
    parseAndValidateRequest.mockImplementation(() => {
      throw parseError;
    });

    await mainHandler({
      req: mockRequest,
      res: mockResponse,
      log: mockLog,
      error: mockError,
    });

    // Verify error handling received a defined action value
    expect(handleErrorResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        e: parseError,
        action: 'unknown', // This should be the default value
        res: mockResponse,
        errorLogger: mockError,
        start: expect.any(Number),
      })
    );
  });
});
