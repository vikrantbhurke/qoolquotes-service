import { MessageController } from "./message.controller";
import { messageService, MessageService } from "./message.service";
import { messageRepository, MessageRepository } from "./message.repository";

messageService.setMessageRepository(messageRepository);

export {
  messageService,
  messageRepository,
  MessageController,
  MessageService,
  MessageRepository,
};
