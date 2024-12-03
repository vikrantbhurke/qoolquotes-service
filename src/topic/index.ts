import { deletionTracker } from "../global/utilities";
import { TopicController } from "./topic.controller";
import { topicService, TopicService } from "./topic.service";
import { topicRepository, TopicRepository } from "./topic.repository";
import { topicUtility, TopicUtility } from "./topic.utility";
import { quoteService } from "../quote";

topicService.setTopicRepository(topicRepository);
topicService.setQuoteService(quoteService);
topicService.setDeletionTracker(deletionTracker);

export {
  topicService,
  topicRepository,
  topicUtility,
  TopicController,
  TopicService,
  TopicRepository,
  TopicUtility,
};
