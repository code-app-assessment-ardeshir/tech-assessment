import pdf from "../src/services/pdf";
import { shippingLabel } from "../src/shipping-label";


// Mock the generatePDF service function
jest.mock('../../src/services/generatePDFService', () => ({
  generatePDF: jest.fn()
}));

describe('createShippingLabel', () => {
  it('calls generatePDF with the correct arguments', async () => {
    const mockRequest: any = {
      body: {
        return_address: {/* ... */},
        order: "CODE-1339",
        name: "Test User",
        language: "en"
      }
    };
    const mockResponse: any = {
      setHeader: jest.fn(),
      send: jest.fn(),
      status: jest.fn(() => mockResponse),
      json: jest.fn()
    };

    // Set up the service to return a fake PDF buffer
    (pdf.generate as jest.Mock).mockResolvedValue(Buffer.from('Fake PDF'));

    await shippingLabel(mockRequest, mockResponse);

    expect(pdf.generate).toHaveBeenCalledWith(mockRequest.body.return_address, mockRequest.body.order, mockRequest.body.name, mockRequest.body.language);
    expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
    expect(mockResponse.send).toHaveBeenCalledWith(Buffer.from('Fake PDF'));
  });

  // ... (additional tests for error handling, etc.)
});