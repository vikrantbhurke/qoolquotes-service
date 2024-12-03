import { UpdateQuoteDTO } from "../quote/dtos";
import { DeletionTracker } from "../global/utilities";
import { QuoteService } from "../quote";
import { TopicRepository } from "./index";
import {
  CreateTopicDTO,
  GetTopicsDTO,
  UpdateTopicDTO,
  GetTopicByNameDTO,
} from "./dtos";

export class TopicService {
  topicRepository: TopicRepository;
  quoteService: QuoteService;
  deletionTracker: DeletionTracker;

  setTopicRepository(topicRepository: TopicRepository): void {
    this.topicRepository = topicRepository;
  }

  setQuoteService(quoteService: QuoteService): void {
    this.quoteService = quoteService;
  }

  setDeletionTracker(deletionTracker: DeletionTracker): void {
    this.deletionTracker = deletionTracker;
  }

  async createTopic(createTopicDTO: CreateTopicDTO) {
    return await this.topicRepository.createTopic(createTopicDTO);
  }

  async countTopicQuotes(tid: string) {
    return await this.quoteService.countTopicQuotes({ topicIds: tid });
  }

  async getTopics(getTopicsDTO: GetTopicsDTO) {
    const { alpha, page, sort, order } = getTopicsDTO;

    let filters = {};

    if (alpha && alpha !== "All") {
      let alphaRegex = { $regex: new RegExp(`^${alpha}`, "i") };
      filters = { name: alphaRegex };
    }

    filters = {
      ...filters,
      sort,
      order,
      page,
    };

    return await this.topicRepository.getTopics(filters);
  }

  async getTopicByName(getTopicByNamDTO: GetTopicByNameDTO) {
    return await this.topicRepository.getTopicByName(getTopicByNamDTO);
  }

  async searchTopics(page: number, search: string) {
    return await this.topicRepository.searchTopics(page, search);
  }

  async updateTopicById(tid: string, updateTopicDTO: UpdateTopicDTO) {
    return await this.topicRepository.updateTopicById(tid, updateTopicDTO);
  }

  async deleteTopicById(tid: string) {
    if (this.deletionTracker.has(tid)) return;
    this.deletionTracker.add(tid);

    let page = 0;

    while (true) {
      const quotesPage = await this.quoteService.getQuotesByTopicId(page, {
        topicIds: tid,
      });

      if (!quotesPage.content.length) break;

      for (const quote of quotesPage.content) {
        if (quote.topicIds.length === 1)
          await this.quoteService.deleteQuoteById(quote._id);

        if (quote.topicIds.length > 1) {
          const index = quote.topicIds.indexOf(tid);
          quote.topicIds.splice(index, 1);
          await this.quoteService.updateQuoteById(quote._id, {
            topicIds: quote.topicIds,
          } as UpdateQuoteDTO);
        }
      }

      if (quotesPage.lastPage) break;
      page++;
    }

    const topic = await this.topicRepository.deleteTopicById(tid);

    this.deletionTracker.remove(tid);

    return topic;
  }
}

export const topicService = new TopicService();
