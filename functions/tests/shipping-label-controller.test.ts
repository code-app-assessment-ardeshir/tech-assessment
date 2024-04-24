import pdf from "../src/services/pdf"
import { shippingLabel } from "../src/shipping-label"


jest.mock('../src/services/pdf', () => ({
  generate: jest.fn()
}))

describe('createShippingLabel', () => {
  it('calls generatePDF with the correct arguments', async () => {
    const mockRequest: any = {
      body: {
        return_address: {
          company: "CODE Internet Applications",
          address: "Frederik Matthesstraat 30",
          zip_code: "2613 ZZ",
          city: "Delft",
          country: "The Netherlands"
        },
        order: "CODE-1339",
        name: "Test User",
        language: "en"
      }
    }
    const mockResponse: any = {
      setHeader: jest.fn(),
      send: jest.fn(),
      status: jest.fn(() => mockResponse),
      json: jest.fn()
    };

    (pdf.generate as jest.Mock)?.mockResolvedValue(Buffer.from('Fake PDF'))

    await shippingLabel(mockRequest, mockResponse)

    expect(pdf.generate).toHaveBeenCalledWith({
      return_address: mockRequest.body.return_address,
      order: mockRequest.body.order,
      name: mockRequest.body.name,
      language: mockRequest.body.language
    })
    expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf')
    expect(mockResponse.send).toHaveBeenCalledWith(Buffer.from('Fake PDF'))
  })

})