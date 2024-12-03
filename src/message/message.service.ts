import { CreateMessageDTO } from "./dtos";
import { MessageRepository } from "./index";

export class MessageService {
  messageRepository: MessageRepository;

  setMessageRepository(messageRepository: MessageRepository): void {
    this.messageRepository = messageRepository;
  }

  async createMessage(createMessageDTO: CreateMessageDTO) {
    return await this.messageRepository.createMessage(createMessageDTO);
  }
}

export const messageService = new MessageService();
