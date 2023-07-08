import { Request, Response } from "express"
import { jsonDatabase } from "../repository/JsonDatabase"

class ChatController {
  public async chat(req: Request, res: Response) {
    let id: number = Math.random() * 1000
    let obj = { teste: "Alguma coisa", id }
    let inserted = await jsonDatabase.insert("teste", obj)

    let selected = await jsonDatabase.select("test")
    return res.json({ selected, inserted })
  }
}

export const chatController = new ChatController()
