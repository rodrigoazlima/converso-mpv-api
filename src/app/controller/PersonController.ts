import { Request, Response } from "express"
import { Person } from "../model/Person"
import { personService } from "../service/PersonService"

class PersonController {
  public async list(req: Request, res: Response) {
    let persons = await personService.getAll()
    return res.json({
      status: 200,
      message: "Failed to save",
      persons,
    })
  }

  public async search(req: Request, res: Response) {
    let person = req.body as Person
    console.debug(
      "PersonController::search::",
      JSON.stringify(person).substring(0, 50)
    )
    try {
      let saved = await personService.findPerson(person)
      return res.json({
        status: 200,
        message: "Found successfully",
        person: saved,
      })
    } catch (error) {
      return res.json({
        status: 200,
        message: "Failed to save",
        error,
      })
    }
  }

  public async save(req: Request, res: Response) {
    try {
      let person = req.body as Person
      console.debug(
        "PersonController::save::",
        JSON.stringify(person)
      )
      let saved = await personService.save(person)
      return res.json({
        status: 200,
        message: "Saved successfully",
        person: saved,
      })
    } catch (error) {
      return res.json({
        status: 200,
        message: "Failed to save",
        error,
      })
    }
  }
}
export const personController = new PersonController()
