import { createServer } from "./server";

const app = createServer();

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  console.log(`Api server is running on port ${port}`);
});
