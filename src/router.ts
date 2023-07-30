import { Router } from "express"
import { chatController } from "./app/controller/ChatController"
import { homeController } from "./app/controller/HomeController"
import { personController } from "./app/controller/PersonController"
import { interactionController } from "./app/controller/InteractionController"

const router: Router = Router();

router.get("/", homeController.home);
router.get("/chat", chatController.list)
router.post("/chat", chatController.save)
router.post("/chat/to/text", chatController.convertChatToText)
router.get("/person", personController.list)
router.post("/person/search", personController.search)
router.post("/person", personController.save)
router.get("/interaction", interactionController.list)
router.post("/interaction", interactionController.save)
router.post("/interaction/to/text", interactionController.convertChatToText)

export { router }

