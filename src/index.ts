import "module-alias/register";
import config from "./config";
import { createServer } from "./server";

const app = createServer();

const port = config.port;

app.listen(port, () => {
  console.log(`Api server is running on port ${port}`);
});
