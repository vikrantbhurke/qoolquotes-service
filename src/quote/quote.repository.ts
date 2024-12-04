import {
  checkModel,
  countModelsByField,
  getModelByField,
  getModelById,
  getModelsByField,
  getRandomModels,
  searchModels,
} from "../global/decorators/read";
import { createModel } from "../global/decorators/create";
import Quote from "./quote.model";
import {
  getQuoteByIdConfig,
  getQuotesByAuthorConfig,
  getQuotesByTopicConfig,
  getRandomQuotesConfig,
  searchQuotesConfig,
} from "./quote.config";
import { updateModelById } from "../global/decorators/update";
import { deleteModelById } from "../global/decorators/delete";
import { AuthorIdDTO, ContentDTO, TopicIdDTO } from "./dtos";

export class QuoteRepository {
  @createModel(Quote)
  async createQuote(newQuote: any, quote?: any) {
    return quote;
  }

  @countModelsByField(Quote)
  async countQuotesByAuthorId(authorIdDTO: AuthorIdDTO, count?: number) {
    return count;
  }

  @countModelsByField(Quote)
  async countQuotesByTopicId(topicIdDTO: TopicIdDTO, count?: number) {
    return count;
  }

  @getRandomModels(Quote, getRandomQuotesConfig)
  async getRandomQuotes(pageSize: number, quotesPage?: any) {
    return quotesPage;
  }

  @searchModels(Quote, searchQuotesConfig)
  async searchQuotes(page: number, search: string, quotesPage?: any) {
    return quotesPage;
  }

  @checkModel(Quote)
  async checkQuoteByContent(contentDTO: ContentDTO, exists?: any) {
    return exists;
  }

  @getModelByField(Quote, {})
  async getQuoteByTopicId(topicIdDTO: TopicIdDTO, quote?: any) {
    return quote;
  }

  @getModelByField(Quote, {})
  async getQuoteByAuthorId(authorIdDTO: AuthorIdDTO, quote?: any) {
    return quote;
  }

  @getModelsByField(Quote, getQuotesByAuthorConfig)
  async getQuotesByAuthorId(
    page: number,
    authorIdDTO: AuthorIdDTO,
    quotesPage?: any
  ) {
    return quotesPage;
  }

  @getModelsByField(Quote, getQuotesByTopicConfig)
  async getQuotesByTopicId(
    page: number,
    topicIdDTO: TopicIdDTO,
    quotesPage?: any
  ) {
    return quotesPage;
  }

  @getModelById(Quote, getQuoteByIdConfig)
  async getQuoteById(qid: string, quote?: any) {
    return quote;
  }

  @updateModelById(Quote)
  async updateQuoteById(qid: string, updateQuoteDTO: any, quote?: any) {
    return quote;
  }

  @deleteModelById(Quote)
  async deleteQuoteById(qid: string, quote?: any) {
    return quote;
  }
}

export const quoteRepository = new QuoteRepository();
