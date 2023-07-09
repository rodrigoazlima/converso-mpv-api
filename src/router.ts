import { Router } from "express"
import { chatController } from "./app/controller/ChatController"
import { homeController } from "./app/controller/HomeController"

const router: Router = Router();

router.get("/", homeController.home);
router.get("/chat", chatController.listChats)
router.post("/chat", chatController.saveChat)
router.post("/chat/to", chatController.convertChatToText)

export { router }

