import express from "express"
import { shippingLabel } from "./shipping-label"
import bodyParser from "body-parser";

// set express and port
const app = express()
const port = 3000

app.use(bodyParser.json());

// set some routes
app.get('/', (req: express.Request, res: express.Response) => res.send('Hello world!'))
app.post('/get-label', /* some middlewares for authentication, etc, */ shippingLabel)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})