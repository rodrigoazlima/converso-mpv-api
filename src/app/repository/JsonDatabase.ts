import { randomUUID } from "crypto"
import { JsonDB, Config } from "node-json-db"

const db = new JsonDB(new Config("db/local", true, false, "/", true))

class JsonDatabase {
  public async save(storage: string, newData: any) {
    let allData = []
    try {
      allData = await db.getData(storage)
    } catch (error) {
      await db.push(storage, [])
      console.error("JsonDatabase::save::Inicialized::", storage)
    }
    if (!Array.isArray(allData)) {
      allData = new Array()
    }
    if (!newData.hash)
      newData.hash = `${randomUUID()}`.replace(/-./g, "") || newData.hash
    if (!allData.find((data) => data.hash === newData.hash)) {
      newData.id = allData.length
      allData.push(newData)
    } else {
      let index = allData.indexOf((data: any) => data.hash === newData.hash)
      newData.id = index
      allData[index] = newData
    }
    await db.push(storage, allData)
    db.save()
    return newData
  }

  public async select(storage: string) {
    let result = []
    try {
      result = await db.getData(storage)
    } catch (error) {
      await db.push(storage, [])
      console.error("JsonDatabase::save::Inicialized::", storage)
    }
    return result
  }
}

export const jsonDatabase = new JsonDatabase()
