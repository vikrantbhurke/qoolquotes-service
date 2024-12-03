import { createModel } from "../global/decorators/create";
import { CreateMessageDTO } from "./dtos";
import Message from "./message.model";

export class MessageRepository {
  @createModel(Message)
  async createMessage(createMessageDTO: CreateMessageDTO, message?: any) {
    return message;
  }
}

export const messageRepository = new MessageRepository();
