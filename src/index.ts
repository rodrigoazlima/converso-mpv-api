import { App } from "./app"
import { AppIntegration } from "./app.integration"

new App().server.listen(3000);
new AppIntegration().integrate();