import { JsonDB, Config } from "node-json-db"

const db = new JsonDB(new Config("db/local", true, false, "/", true))

class JsonDatabase {
  /*
  public async select(data, filter, pagination) {
    interface FooBar {
      Hello: string
      World: number
    }
    const object = { Hello: "World", World: 5 } as FooBar

    await db.push("/test", object)

    //Will be typed as FooBar in your IDE
    const result = await db.getObject<FooBar>("/test")

    return result
  }
*/

  public async insert(storage: string, newData: any) {
    let allData = await db.getData(storage) || []
    allData.push(newData)
    await db.push(storage, allData)
    db.save()
  }

  public async select(storage: string) {
    let result = undefined
    try {
      result = await db.getData(storage)
    } catch (error) {
      console.error(error)
    }
    return result
  }
}

export const jsonDatabase = new JsonDatabase()
