import { Request, Response } from "express"
import { jsonDatabase } from "../repository/JsonDatabase"

const CHAT_PATH = "chat_messages"

class ChatController {
  public async listChats(req: Request, res: Response) {
    let selected = await jsonDatabase.select(CHAT_PATH)
    return res.json(selected)
  }

  public async saveChat(req: Request, res: Response) {
    let newData = req.body
    let selected = await jsonDatabase.insert(CHAT_PATH, newData)
    return res.json({
      id: selected?.id,
      status: 200,
      message: "Saved successfully",
    })
  }

  public async convertChatToText(req: Request, res: Response) {
    let allChats = await jsonDatabase.select(CHAT_PATH)
    let convertedText = allChats
      .map(
        (chat: any) =>
          `${chat.from} sent a message to ${chat.to} with the contet "${chat.message}"`
      )
      .join("\n")
    res.set("Content-Type", "text/html")
    return res.send(
      "Chat GPT i want you to impersonate a tech security specialist.\n" +
        "Now i will give you a conversation, and you will give me back a list of probable spams tatics this conversation may have.\n" +
        "The list will have only titles and probabilities in percentage.\n" +
        "Ignore sending me anything else\n" +
        "Conversation:\n" +
        convertedText
    )
  }
}
export const chatController = new ChatController()
