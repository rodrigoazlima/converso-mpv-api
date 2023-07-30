import * as fs from "fs"
import path from "path"
import { Interaction } from "./app/model/Interaction"
import { Person } from "./app/model/Person"
import { interactionService } from "./app/service/InteractionService"
import { personService } from "./app/service/PersonService"

export class AppIntegration {
  constructor() {}

  public async integrate(integratedProfile: string = "rodrigoazlima_") {
    let integratedPerson: Person = await personService.findPersonByAlias(
      integratedProfile
    )
    integratedPerson.instagram = integratedProfile
    await personService.save(integratedPerson)
    
    console.log("AppIntegration::integrate::Messages")
    var inboxPath = path.resolve("./src/app/export/messages/inbox/")
    fs.readdir(inboxPath, (err: any, files: any) => {
      files = files || []
      files.forEach(async (subdir: any) => {
        let filePath = `./src/app/export/messages/inbox/${subdir}/message_1.json`
        let absolutePath = path.resolve(filePath)
        let data = fs.readFileSync(absolutePath, "utf-8")
        let json = JSON.parse(data)
        let subdirName = `${subdir}`
        let toUsername = subdirName.substring(0, subdirName.lastIndexOf("_"))
        let toUsernamePerson: Person = await personService.findPersonByAlias(
          toUsername
        )
        integratedPerson.instagram = toUsername
        await personService.save(toUsernamePerson)
        json?.messages?.forEach((msg: any) => {
          let interaction: Interaction = {
            id: Number.NaN,
            type: "Message",
            from:
              msg.sender_name.toLowerCase() ===
              integratedPerson.customAlias.includes(msg.name)
                ? integratedPerson
                : toUsernamePerson,
            to:
              msg.sender_name.toLowerCase() !==
              integratedPerson.customAlias.includes(msg.name)
                ? [integratedPerson]
                : [toUsernamePerson],
            message: msg.content,
            timestamp: this.ts2human(msg.timestamp_ms),
            createDate: new Date().toLocaleString(),
          }
          interactionService.save(interaction)
        })
        console.log(
          "AppIntegration::integrate::Messages::inbox::",
          filePath,
          json.messages.length,
          data.length
        )
      })
    })
    if (true) return
    /*console.log(
      "AppIntegration::integrate::Following",
      followersRequest_1Json.length
    )
    followingRequestJson?.relationships_following?.forEach((element) => {
      let interaction: Interaction = {
        id: Number.NaN,
        type: "Follow Request",
        from: integratedProfile,
        to: element.string_list_data[0].value,
        message: "Accepted the follow request on social media.",
        timestamp: this.ts2human(element.string_list_data[0].timestamp),
        createDate: new Date().toLocaleString(),
      }
      interactionService.save(interaction)
    })
    console.log(
      "AppIntegration::integrate::Followers::",
      followersRequest_1Json.length
    )
    followersRequest_1Json?.forEach((element) => {
      let interaction: Interaction = {
        id: Number.NaN,
        type: "Follow Request",
        from: element.string_list_data[0].value,
        to: integratedProfile,
        message: "Accepted the follow request on social media.",
        timestamp: this.ts2human(element.string_list_data[0].timestamp),
        createDate: new Date().toLocaleString(),
      }
      interactionService.save(interaction)
    })*/
  }

  private ts2human(ts: number): string {
    var dt = new Date(ts * 1000)
    return dt.toLocaleString()
  }
  private human2ts(di: string): number {
    var ts = Math.floor(Date.parse(di) / 1000)
    return ts
  }
}
