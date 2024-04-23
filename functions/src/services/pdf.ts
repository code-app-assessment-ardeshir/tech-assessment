import PDFDocument from 'pdfkit'
import path from 'path'
import { ILabel } from '../interfaces/label'

export default {
  generate(label: ILabel): Promise<Buffer> {
    const { return_address, order, name } = label

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument()
      const buffers: Buffer[] = []

      doc.on('data', buffers.push.bind(buffers))
      doc.on('end', () => resolve(Buffer.concat(buffers)))

      const boldFont = 'Helvetica-Bold'
      const normalFont = 'Helvetica'

      // todo: draw the box
      doc.font(boldFont).fontSize(14).text('POSTAGE REQUIRED', { align: 'center' })
      doc.moveDown()

      doc.font(normalFont).fontSize(10).text('Please paste this address label on the outside of the box', { align: 'center' })
      doc.font(normalFont).fontSize(10).text('Please put this part inside the box on top of your products,', { align: 'center' })
      doc.font(normalFont).fontSize(10).text('so we can identify your return parcel upon arrival', { align: 'center' })
      doc.moveDown()

      doc.font(boldFont).fontSize(12).text('Order Number:', 100)
      doc.font(normalFont).fontSize(12).text(order, 200)
      doc.font(boldFont).fontSize(12).text('Name:', 100, doc.y)
      doc.font(normalFont).fontSize(12).text(name, 200)
      doc.moveDown()

      doc.font(boldFont).fontSize(12).text(return_address.company, { align: 'left' })
      doc.font(normalFont).fontSize(10).text(return_address.address, { align: 'left' })
      doc.font(normalFont).fontSize(10).text(`${return_address.zip_code} ${return_address.city}`, { align: 'left' })
      doc.font(normalFont).fontSize(10).text(return_address.country, { align: 'left' })
      doc.moveDown()

      const logoPath = path.join(__dirname, '../../../assets/code-logo.png')
      doc.image(logoPath, doc.x, doc.y, { width: 250 })
      doc.moveDown()

      doc.end()
    })
  }
}
