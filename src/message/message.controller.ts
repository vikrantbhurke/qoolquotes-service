import { Body, Controller, Post, Res } from "routing-controllers";
import { MessageService, messageService } from "./index";
import { CreateMessageDTO } from "./dtos";
import { Response } from "express";

@Controller("/messages")
export class MessageController {
  messageService: MessageService;

  constructor() {
    this.messageService = messageService;
  }

  @Post("/")
  async createMessage(
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } })
    createMessageDTO: CreateMessageDTO,
    @Res() response: Response
  ) {
    try {
      this.messageService.createMessage(createMessageDTO);
      return response.status(201).send({ message: "Message sent." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }
}
