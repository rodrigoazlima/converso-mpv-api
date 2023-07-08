import { Router } from "express"
import { chatController } from "./app/controller/ChatController"
import { homeController } from "./app/controller/HomeController"

const router: Router = Router();

//Routes
router.get("/", homeController.home);
router.get("/chat", chatController.chat)

export { router }

