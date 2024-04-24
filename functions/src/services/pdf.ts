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

      /* 
      ** We can make an abstraction for the following code
      ** by creating a function that receives the doc object
      ** and the data to be printed
      ** so that we can reuse it in other graphics
      */ 
     
      const bold = 'Helvetica-Bold'
      const normal = 'Helvetica'
      const M = 81
      const H = doc.page.height
      const W = doc.page.width

      // Top right corner
      const rectWidth = toPT(3) // 3 cm
      const rectHeight = toPT(3.5)
      doc.rect(W - M - rectWidth, M, rectWidth, rectHeight)
      doc.stroke("#000")
      doc.font(normal).fontSize(11)
      doc.text(t('POSTAGE_REQUIRED', language), W - M - rectWidth + 5, M + 34, { align: 'center', lineGap: 9, width: rectWidth - 10, height: rectHeight })

      // Logo
      const logoPath = path.join(__dirname, '../../../assets/code-logo.png')
      doc.image(logoPath, M, M, { width: toPT(6.2) })

      // Return address
      doc.font(bold)
      doc.fontSize(18)
      doc.text(return_address.company, M, M + 70, { align: 'left' })
      doc.text(return_address.address, { align: 'left' })
      doc.text(`${return_address.zip_code} ${return_address.city}`, { align: 'left' })
      doc.text(return_address.country, { align: 'left' })

      // dashed line
      drawTriangle(doc, M + 54, H / 2 - 68, 'up');
      drawTriangle(doc, W - 54 - M, H / 2 - 68, 'up');
      drawTriangle(doc, M + 54, H / 2 + 0, 'down');
      drawTriangle(doc, W - 54 - M, H / 2 + 0, 'down');
      doc.moveTo(M, H / 2 - 30)
      doc.lineTo(W - M, H / 2 - 30)
      doc.dash(3, { space: 2 })
      doc.stroke()

      // Dashed line text
      doc.font(normal)
      doc.fill('#cc0100')
      doc.fontSize(10.8)
      doc.text(t('PUT_LABEL_OUTSIDE', language), M + 70, H / 2 - 63, { align: 'center', width: W - 2 * (M + 70) })
      doc.text(t('PUT_LABEL_INSIDE', language), M + 70, H / 2 - 5, { align: 'center', width: W - 2 * (M + 70) })

      // Order number and name
      doc.fill('#000')
      doc.fontSize(18)
      doc.text(t('ORDER_NUMBER', language) + ':', M, H / 2 + 120)
      doc.text(t('NAME', language) + ':', M, H / 2 + 190)
      doc.font(bold)
      doc.text(order, M + 150, H / 2 + 120)
      doc.text(name, M + 150, H / 2 + 190)

      doc.end()
    })
  }
}

function drawTriangle(doc: PDFKit.PDFDocument, x: number, y: number, direction: 'up' | 'down') {
  const size = 15;
  const color = '#cc0100';
  let points;
  if (direction === 'up') {
    points = [[x, y], [x - size / 2, y + size * 0.67], [x + size / 2, y + size * 0.67]];
  } else {
    points = [[x - size / 2, y], [x + size / 2, y], [x, y + size * 0.67]];
  }
  doc.polygon(...points).fill(color);
}

function toPT(value: number): number {
  // value is CM
  return value * 72 / 2.54
}