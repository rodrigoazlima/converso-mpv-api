import { Request, Response } from "express";

class HomeController {
  public home(req: Request, res: Response) {
    return res.json({
      response: "Converso MVP API",
    });
  }
}

export const homeController = new HomeController();
