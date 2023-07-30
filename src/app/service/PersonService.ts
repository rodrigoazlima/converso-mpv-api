import { PUBLIC_PERSON, Person } from "../model/Person"
import { jsonDatabase } from "../repository/JsonDatabase"
export const PERSON_PATH = "./db/person"

class PersonService {
  public async getAll(): Promise<Person[]> {
    return await jsonDatabase.select(PERSON_PATH)
  }

  public async save(person: Person) {
    let personStored: Person = await personService.findPerson(person)
    console.log("PersonService::save::findPerson::", personStored.hash)
    let updatedPerson = await personService.setProperSettings(
      personStored,
      person
    )
    let selected = await jsonDatabase.save(PERSON_PATH, updatedPerson)
    console.debug(
      "PersonService::save::insert::",
      PERSON_PATH,
      selected.hash,
      JSON.stringify(selected)
    )
    return selected
  }

  public async findPersonByAlias(alias: string): Promise<Person> {
    try {
      alias = (alias || "").toLowerCase()
      let persons: Array<Person> =
        (await jsonDatabase.select(PERSON_PATH)) || []
      let foundPerson: Array<Person> = await persons.filter(
        (p) => p.hash === alias
      )
      if (foundPerson.length > 0) {
        return await this.assignDefaults(foundPerson[0])
      }
      foundPerson = await persons.filter((p) =>
        (p?.customAlias || "")
          .toLowerCase()
          .split(";")
          .find((ca) => alias.split(";").find((a) => ca.includes(a)))
      )
      if (foundPerson.length > 0) {
        return await this.assignDefaults(foundPerson[0])
      }
    } catch (er) {
      console.error("Error finding person", alias, er)
    }
    let newPerson = { customAlias: `${alias};` } as Person
    console.debug("PersonService::findPerson::NO_DATA", JSON.stringify(alias))
    let selected = await jsonDatabase.save(PERSON_PATH, newPerson)
    return selected
  }

  public async findPerson(person: Person): Promise<Person> {
    try {
      let persons: Array<Person> =
        (await jsonDatabase.select(PERSON_PATH)) || []
      let foundPerson: Array<Person> = await persons.filter(
        (p) => p.hash === person.hash
      )
      if (foundPerson.length > 0) {
        console.debug(
          "PersonService::findPerson::byMain::",
          JSON.stringify(foundPerson).substring(0, 50)
        )
        return await this.assignDefaults(foundPerson[0])
      }
      foundPerson = await persons.filter(
        (p) =>
          p?.instagram === person?.instagram ||
          p?.whatsapp === person?.whatsapp ||
          (p?.customAlias || "")
            .split(",")
            .find(
              (alias) =>
                alias.toLowerCase() ===
                (person?.customAlias || "").toLowerCase()
            ) ||
          `${p?.name},${p?.age}` === `${person?.name},${person?.age}}`
      )
      if (foundPerson.length > 0) {
        console.debug(
          "PersonService::findPerson::byKey::",
          JSON.stringify(foundPerson).substring(0, 50),
          foundPerson.length
        )
        return await this.assignDefaults(foundPerson[0])
      }
    } catch (er) {
      console.error("Error finding person", person, er)
    }
    console.debug("PersonService::findPerson::NO_DATA", JSON.stringify(person))
    return {} as Person
  }

  public async compareByTimestamp(a: any, b: any) {
    const timestampA = new Date(a.timestamp).getTime()
    const timestampB = new Date(b.timestamp).getTime()
    return timestampA - timestampB
  }

  public async setProperSettings(
    storedPerson: Person,
    newPerson: Person
  ): Promise<Person> {
    let person = {
      id: newPerson.id || storedPerson.id,
      hash: newPerson.hash || storedPerson.hash,
      name: newPerson.name || storedPerson.name,
      age: newPerson.age || storedPerson.age,
      city: newPerson.city || storedPerson.city,
      instagram: newPerson.instagram || storedPerson.instagram,
      whatsapp: newPerson.whatsapp || storedPerson.whatsapp,
      customAlias: newPerson.customAlias || storedPerson.customAlias || "",
      study: newPerson.study || storedPerson.study,
      work: newPerson.work || storedPerson.work,
      zodiacSign: newPerson.zodiacSign || storedPerson.zodiacSign,
      firstMatch: newPerson.firstMatch || storedPerson.firstMatch,
      description: newPerson.description || storedPerson.description,
    } as Person
    if (!person.customAlias.includes(`${person.instagram};`)) {
      person.customAlias += `${person.instagram};`
    }
    if (!person.customAlias.includes(`${person.whatsapp};`)) {
      person.customAlias += `${person.whatsapp};`
    }
    if (
      person.age &&
      !person.customAlias.includes(`${person.name},${person.age};`)
    ) {
      person.customAlias += `${person.name},${person.age};`
    }
    return person
  }

  public async assignDefaults(person: Person): Promise<Person> {
    let key = (person.zodiacSign || "_").toLocaleLowerCase()
    person.zodiacDesc =
      {
        aries:
          "Confident, courageous, and ambitious individuals with a pioneering spirit.",
        taurus:
          "Reliable, patient, and practical individuals who appreciate stability and material comforts.",
        gemini:
          "Versatile, curious, and expressive individuals who love intellectual stimulation and socializing.",
        cancer:
          "Nurturing, sensitive, and intuitive individuals with a strong emotional depth and attachment to home and family.",
        leo: "Charismatic, creative, and confident individuals who seek attention and thrive in the spotlight.",
        virgo:
          "Detail-oriented, analytical, and practical individuals with a strong desire for perfection and order.",
        libra:
          "Diplomatic, harmonious, and social individuals who value balance, fairness, and relationships.",
        scorpio:
          "Intense, passionate, and determined individuals with a keen intuition and a desire for deep connections.",
        sagittarius:
          "Adventurous, optimistic, and free-spirited individuals who seek knowledge, new experiences, and freedom.",
        capricorn:
          "Ambitious, disciplined, and responsible individuals who strive for success and value traditions.",
        aquarius:
          "Independent, intellectual, and innovative individuals who are known for their humanitarian and unconventional nature.",
        pisces:
          "Compassionate, intuitive, and artistic individuals with a deep connection to emotions and spirituality.",
        _: "",
      }[key] ||
      person.zodiacDesc ||
      ""
    return person
  }
}
export const personService = new PersonService()

//Init
personService.save(PUBLIC_PERSON)
