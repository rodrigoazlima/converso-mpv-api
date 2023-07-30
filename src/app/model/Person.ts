export interface Person {
  id: string
  hash: string
  name: string
  age: number
  sex: string
  city: string
  instagram: string
  whatsapp: string
  customAlias: string
  study: string
  work: string
  zodiacSign: string
  zodiacDesc: string
  firstMatch: string
  description: string
}

export const PUBLIC_PERSON: Person = {
  id: "",
  hash: "0",
  name: "everyone",
  age: 0,
  sex: "unknow",
  city: "any",
  instagram: "any",
  whatsapp: "any",
  customAlias: "any;_;public;everyone;_public_",
  study: "any",
  work: "any",
  zodiacSign: "_",
  zodiacDesc: "",
  firstMatch: "",
  description: "everyone",
}
