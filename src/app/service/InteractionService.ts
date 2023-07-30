import { Interaction } from "../model/Interaction"
import { PUBLIC_PERSON, Person } from "../model/Person"
import { jsonDatabase } from "../repository/JsonDatabase"
import { personService } from "./PersonService"
export const INTERACTION_PATH = "./db/interaction"

class InteractionService {
  public async getAll(from: string, to: string): Promise<Interaction[]> {
    let fromPerson: Person = await personService.findPersonByAlias(from)
    let toPerson: Person = await personService.findPersonByAlias(to)
    let interactions: Interaction[] = []
    interactions.concat(await this.findByPerson(fromPerson, toPerson))
    interactions.concat(await this.findByPerson(fromPerson, PUBLIC_PERSON))
    interactions.concat(await this.findByPerson(toPerson, fromPerson))
    interactions.concat(await this.findByPerson(toPerson, PUBLIC_PERSON))
    console.debug("InteractionService::getAll::",fromPerson,toPerson, interactions.length)
    return interactions
  }

  public async save(interaction: Interaction): Promise<Interaction> {
    let key = `${INTERACTION_PATH}/${interaction.from.hash}}`
    let interactions: Array<Interaction> = []
    try {
      interactions = await jsonDatabase.select(key)
    } catch (ignore) {}
    interaction.id = interactions.length
    interaction.createDate = new Date().toLocaleString()
    await interactions.push(interaction)
    interactions.sort(this.compareByTimestamp)
    jsonDatabase.save(key, interactions)
    console.debug("InteractionService::save::", JSON.stringify(interaction))
    return interaction
  }

  public async findByPerson(
    from: Person,
    to: Person
  ): Promise<Array<Interaction>> {
    if (!from?.hash) return []
    if (!to?.hash) return []
    let key = `${INTERACTION_PATH}/${from.hash}/${to.hash}`
    let interactions: Array<Interaction> =
      (await jsonDatabase.select(key)) || []
    return interactions
  }

  public compareByTimestamp(a: any, b: any): number {
    const timestampA = new Date(a.timestamp).getTime()
    const timestampB = new Date(b.timestamp).getTime()
    return timestampA - timestampB
  }
}
export const interactionService = new InteractionService()
