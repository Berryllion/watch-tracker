import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { Public } from "src/public";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  helloWorld(): string {
    return this.appService.helloWorld();
  }
}
