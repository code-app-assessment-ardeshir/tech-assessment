import express from "express"
import { shippingLabel } from "./shipping-label"
import bodyParser from "body-parser"
import { authenticate } from "./middlewares/auth"
import { forceSecure } from "./middlewares/ssl"
import { validatePDFAPI } from "./middlewares/validate"

// set express and port
const app = express()
const port = 3000

app.use(bodyParser.json())

// set some routes
app.get('/', (req: express.Request, res: express.Response) => res.send('Hello world!'))
app.post('/get-label', authenticate, forceSecure, validatePDFAPI, shippingLabel)

// Export the server for testing purposes
export const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
});

export default app