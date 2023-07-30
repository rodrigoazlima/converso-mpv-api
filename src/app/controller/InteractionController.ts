import { Request, Response } from "express"
import { Interaction } from "../model/Interaction"
import { interactionService } from "../service/InteractionService"

const PROMPTS: any = {
  spam:
    "I want you to impersonate a tech security specialist.\n" +
    "Now i will give you a conversation that you are going to read. " +
    "When I tell you to you show the result you will give me back a list of probable spams tatics this conversation may have.\n" +
    "The list will have only titles and probabilities in percentage.\n" +
    "Ignore sending me anything else\n" +
    "Conversation:\n",
  narcisim:
    "I want you to impersonate a psychology security specialist.\n" +
    "Now i will give you a conversation that you are going to read. " +
    "When I tell you to you show the result you will give me back a list of probable mental disorders or mental health issues.\n" +
    "The list will have only titles and probabilities in percentage.\n" +
    "Ignore sending me anything else.\n" +
    "Conversation:\n",
  continue:
    "Conversation is going to continue on the next promp. Wait for the imput and say OK if you could read all the messages.",
  end: "Conversation has ended. You can now show me your ",
}

class InteractionController {
  public async list(req: Request, res: Response) {
    let personFrom: string = `${req.query.from}`
    let personTo: string = `${req.query.to}`
    let interactions = await interactionService.getAll(personFrom, personTo)
    return res.json(interactions)
  }

  public async save(req: Request, res: Response) {
    let interaction: Interaction = req.body
    let selected = await interactionService.save(interaction)
    return res.json({
      id: selected?.id,
      created_date: selected?.createDate,
      status: 200,
      message: "Saved successfully",
    })
  }

  private _compareByTimestamp(a: any, b: any) {
    const timestampA = new Date(a.timestamp).getTime()
    const timestampB = new Date(b.timestamp).getTime()
    return timestampA - timestampB
  }

  public async convertChatToText(req: Request, res: Response) {}
}
export const interactionController = new InteractionController()
