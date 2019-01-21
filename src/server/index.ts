import express, {Request, Response} from "express";
import cors from "cors";

import {listAllPackagesSorted, searchByName} from "./controllers";

const app: express.Application = express();
const PORT: number | string = process.env.PORT || 5000;

app.use(cors());

app.get("/api/packages", (req: Request, res: Response) => {
  res.send(listAllPackagesSorted);
});

app.get("/api/packages/:name", (req: Request, res: Response) => {
  let { name } = req.params;
  const response = searchByName(name);
  res.send(response);
});

app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
