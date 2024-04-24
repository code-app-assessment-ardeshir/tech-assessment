import request from 'supertest'
import app from '../src/index'

describe('/get-label endpoint', () => {
  it('should create a PDF and return it as a response', async () => {
    const response = await request(app)
      .post('/get-label')
      .send({
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
      })
      .expect('Content-Type', /pdf/)
      .expect(200)
    
    expect(Buffer.isBuffer(response.body)).toBeTruthy()

    // Optionally, check if the PDF starts with the PDF header
    expect(response.body.toString('ascii', 0, 5)).toEqual('%PDF-')
  })

  it('should handle invalid input with an appropriate error message', async () => {
    const response = await request(app)
      .post('/get-label')
      .send({}) // Sending an empty body or invalid data
      .expect('Content-Type', /json/)
      .expect(400)

    expect(response.body.error).toBeDefined()
  })

  it('should require a return address', async () => {
    const response = await request(app)
      .post('/get-label')
      .send({
        order: "CODE-1339",
        name: "Test User",
        language: "en"
      })
      .expect(400)

    expect(response.body.error).toBeDefined()
    expect(response.body.error).toContain('return_address is required')
  })

})
