import { DeletionTracker } from "../global/utilities";
import { AuthorService } from "../author";
import { TopicService } from "../topic";
import { QuoteRepository, QuoteUtility } from "./index";
import { PlaylistQuoteService } from "../playlist-quote";
import { QuoteLikerService } from "../quote-liker";
import { PlaylistService } from "../playlist";
import { PlaylistIdDTO } from "../playlist/dtos";
import {
  AuthorIdDTO,
  ContentDTO,
  CreateQuoteDTO,
  TopicIdDTO,
  UpdateQuoteDTO,
} from "./dtos";

export class QuoteService {
  quoteRepository: QuoteRepository;
  quoteUtility: QuoteUtility;
  topicService: TopicService;
  authorService: AuthorService;
  playlistService: PlaylistService;
  playlistQuoteService: PlaylistQuoteService;
  quoteLikerService: QuoteLikerService;
  deletionTracker: DeletionTracker;

  setQuoteRepository(quoteRepository: QuoteRepository) {
    this.quoteRepository = quoteRepository;
  }

  setQuoteUtility(quoteUtility: QuoteUtility) {
    this.quoteUtility = quoteUtility;
  }

  setTopicService(topicService: TopicService) {
    this.topicService = topicService;
  }

  setAuthorService(authorService: AuthorService) {
    this.authorService = authorService;
  }

  setPlaylistService(playlistService: PlaylistService) {
    this.playlistService = playlistService;
  }

  setPlaylistQuoteService(playlistQuoteService: PlaylistQuoteService) {
    this.playlistQuoteService = playlistQuoteService;
  }

  setQuoteLikerService(quoteLikerService: QuoteLikerService) {
    this.quoteLikerService = quoteLikerService;
  }

  setDeletionTracker(deletionTracker: DeletionTracker) {
    this.deletionTracker = deletionTracker;
  }

  async createQuotes(createQuotesDTO: CreateQuoteDTO[]) {
    for (const createQuoteDTO of createQuotesDTO) {
      await this.createQuote(createQuoteDTO);
    }
  }

  async createQuote(createQuoteDTO: CreateQuoteDTO) {
    const exists = await this.checkQuoteByContent({
      content: createQuoteDTO.content,
    });

    if (exists) throw new Error("Quote already exists in the database.");

    const quoteWithTopics =
      this.quoteUtility.extractTopicsFromQuote(createQuoteDTO);

    let quoteWithTopicIdsAndAuthorId: any = {
      content: createQuoteDTO.content,
      authorId: "",
      topicIds: [],
    };

    for (const topicName of quoteWithTopics.topics) {
      const existingTopic = await this.topicService.getTopicByName({
        name: topicName,
      });

      if (existingTopic) {
        quoteWithTopicIdsAndAuthorId.topicIds.push(existingTopic._id);
        continue;
      }

      const newTopic = await this.topicService.createTopic({ name: topicName });
      quoteWithTopicIdsAndAuthorId.topicIds.push(newTopic._id);
    }

    const existingAuthor = await this.authorService.getAuthorByName({
      name: createQuoteDTO.author,
    });

    if (existingAuthor) {
      quoteWithTopicIdsAndAuthorId.authorId = existingAuthor._id;
      return await this.quoteRepository.createQuote(
        quoteWithTopicIdsAndAuthorId
      );
    }

    const newAuthor = await this.authorService.createAuthor({
      name: createQuoteDTO.author,
    });

    quoteWithTopicIdsAndAuthorId.authorId = newAuthor._id;
    return await this.quoteRepository.createQuote(quoteWithTopicIdsAndAuthorId);
  }

  async countAuthorQuotes(authorIdDTO: AuthorIdDTO) {
    return await this.quoteRepository.countQuotesByAuthorId(authorIdDTO);
  }

  async countTopicQuotes(topicIdDTO: TopicIdDTO) {
    return await this.quoteRepository.countQuotesByTopicId(topicIdDTO);
  }

  async getRandomQuotes(pageSize: number) {
    return await this.quoteRepository.getRandomQuotes(pageSize);
  }

  async searchQuotes(page: number, search: string) {
    return await this.quoteRepository.searchQuotes(page, search);
  }

  async checkQuoteByContent(contentDTO: ContentDTO) {
    return await this.quoteRepository.checkQuoteByContent(contentDTO);
  }

  async getQuoteByTopicId(topicIdDTO: TopicIdDTO) {
    return await this.quoteRepository.getQuoteByTopicId(topicIdDTO);
  }

  async getQuoteByAuthorId(authorIdDTO: AuthorIdDTO) {
    return await this.quoteRepository.getQuoteByAuthorId(authorIdDTO);
  }

  async getQuotesByTopicId(page: number, topicIdDTO: TopicIdDTO) {
    return await this.quoteRepository.getQuotesByTopicId(page, topicIdDTO);
  }

  async getQuotesByAuthorId(page: number, authorIdDTO: AuthorIdDTO) {
    return await this.quoteRepository.getQuotesByAuthorId(page, authorIdDTO);
  }

  async getQuotesByPlaylistId(page: number, playlistIdDTO: PlaylistIdDTO) {
    const playlistQuotesPage =
      await this.playlistQuoteService.getPlaylistsQuotesByPlaylistId(
        page,
        playlistIdDTO
      );

    if (!playlistQuotesPage?.content.length)
      throw new Error("Quotes not found.");

    let quotes = [];

    for (const playlistQuote of playlistQuotesPage.content) {
      const quote = await this.getQuoteById(playlistQuote.quoteId);
      if (!quote) throw new Error("Quote not found.");
      quotes.push(quote);
    }

    return {
      ...playlistQuotesPage,
      content: quotes,
    };
  }

  async getQuoteById(qid: string) {
    return await this.quoteRepository.getQuoteById(qid);
  }

  async updateQuoteById(qid: string, updateQuoteDTO: UpdateQuoteDTO) {
    return await this.quoteRepository.updateQuoteById(qid, updateQuoteDTO);
  }

  async deleteQuoteById(qid: string) {
    if (this.deletionTracker.has(qid)) return;
    this.deletionTracker.add(qid);

    await this.quoteLikerService.deleteQuotesLikersByQuoteId({ quoteId: qid });

    const quote = await this.quoteRepository.deleteQuoteById(qid);

    for (const topicId of quote.topicIds) {
      const quoteByTopicId = await this.getQuoteByTopicId({
        topicIds: topicId,
      });

      if (!quoteByTopicId) await this.topicService.deleteTopicById(topicId);
    }

    const quoteByAuthorId = await this.getQuoteByAuthorId({
      authorId: quote.authorId,
    });

    if (!quoteByAuthorId)
      await this.authorService.deleteAuthorById(quote.authorId);

    let page = 0;

    while (true) {
      const quotePlaylistsPage =
        await this.playlistQuoteService.getPlaylistsQuotesByQuoteId(page, {
          quoteId: qid,
        });

      if (!quotePlaylistsPage?.content.length) break;

      for (const playlistQuote of quotePlaylistsPage.content)
        await this.playlistQuoteService.deletePlaylistQuote({
          playlistId: playlistQuote.playlistId,
          quoteId: qid,
        });

      if (quotePlaylistsPage.lastPage) break;
      page++;
    }

    this.deletionTracker.remove(qid);

    return quote;
  }
}

export const quoteService = new QuoteService();
