import PDFDocument from 'pdfkit'
import path from 'path'
import { ILabel } from '../interfaces/label'
import { t } from './translation'

export default {
  generate(label: ILabel): Promise<Buffer> {
    const { return_address, language, order, name } = label

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4' });
      const buffers: Buffer[] = []

      doc.on('data', buffers.push.bind(buffers))
      doc.on('end', () => resolve(Buffer.concat(buffers)))

      const boldFont = 'Helvetica-Bold'
      const normalFont = 'Helvetica'

      const rectWidth = toPT(3) // 3 cm
      const rectHeight = toPT(3.5)
      const margin = 81

      doc
        .rect(doc.page.width - margin - rectWidth, margin, rectWidth, rectHeight)
        .stroke("#000")
        .font(normalFont).fontSize(11)
        .text(t('POSTAGE_REQUIRED', language), doc.page.width - margin - rectWidth + 5, margin + 34, { align: 'center', lineGap: 9, width: rectWidth - 10, height: rectHeight })

      const logoPath = path.join(__dirname, '../../../assets/code-logo.png')
      doc.image(logoPath, margin, margin, { width: toPT(6.2) })

      doc
        .font(boldFont)
        .fontSize(18)
        .text(return_address.company, margin, margin + 70, { align: 'left' })
        .text(return_address.address, { align: 'left' })
        .text(`${return_address.zip_code} ${return_address.city}`, { align: 'left' })
        .text(return_address.country, { align: 'left' })

      function drawTriangle(doc: PDFKit.PDFDocument, x: number, y: number, direction: 'up' | 'down', size: number = 15, color: string = '#cc0100') {
        let points;
        if (direction === 'up') {
          points = [[x, y], [x - size / 2, y + size * 0.67], [x + size / 2, y + size * 0.67]];
        } else {
          points = [[x - size / 2, y], [x + size / 2, y], [x, y + size * 0.67]];
        }
        doc.polygon(...points).fill(color);
      }

      drawTriangle(doc, margin + 54, doc.page.height / 2 - 68, 'up');
      drawTriangle(doc, doc.page.width - 54 - margin, doc.page.height / 2 - 68, 'up');
      drawTriangle(doc, margin + 54, doc.page.height / 2 + 0, 'down');
      drawTriangle(doc, doc.page.width - 54 - margin, doc.page.height / 2 + 0, 'down');


      doc.moveTo(margin, doc.page.height / 2 - 30)
        .lineTo(doc.page.width - margin, doc.page.height / 2 - 30)
        .dash(3, { space: 2 })
        .stroke()

      doc.font(normalFont)
      doc.fontSize(10.8)
      doc.text(t('PUT_LABEL_OUTSIDE', language), margin + 70, doc.page.height / 2 - 63, { align: 'center', width: doc.page.width - 2 * (margin + 70) }).fill('#cc0100')
      doc.text(t('PUT_LABEL_INSIDE', language), margin + 70, doc.page.height / 2 - 5, { align: 'center', width: doc.page.width - 2 * (margin + 70) }).fill('#cc0100')

      doc.fill('#000')
      doc.fontSize(18)
      doc.text(t('ORDER_NUMBER', language) + ':', margin, doc.page.height / 2 + 120)
      doc.text(t('NAME', language) + ':', margin, doc.page.height / 2 + 190)
      doc.font(boldFont)
      doc.text(order, margin + 150, doc.page.height / 2 + 120)
      doc.text(name, margin + 150, doc.page.height / 2 + 190)

      doc.end()
    })
  }
}


// function convertToCM (value: number): number {
//   // value is PostScript points (1/72 inch)
//   return value * 2.54 / 72
// }

function toPT(value: number): number {
  // value is CM
  return value * 72 / 2.54
}