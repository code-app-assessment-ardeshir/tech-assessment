import express from "express";
import pdf from "../services/pdf";
import { ILabel } from "../interfaces/label";

/**
 * Route: get the shipping label
 * 
 * @param req Express request
 * @param res Express response
 */
export const shippingLabel = async (req: express.Request, res: express.Response) => {
  try {
    const pdfBuffer = await pdf.generate(req.body as ILabel);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=label-${req.body.order}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF', error);
    res.status(500).send('Error generating PDF');
  }
}