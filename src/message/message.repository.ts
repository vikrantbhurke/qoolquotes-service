import Message from "./message.model";
import { CreateMessageDTO } from "./dtos";
import { createModel } from "../global/decorators/create";

export class MessageRepository {
  @createModel(Message)
  async createMessage(createMessageDTO: CreateMessageDTO, message?: any) {
    return message;
  }
}

export const messageRepository = new MessageRepository();
