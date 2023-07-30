import { Person } from "./Person"

export interface Interaction {
  id: number
  type: string
  message: string
  to: Array<Person>
  from: Person
  timestamp: string
  createDate: string
}
