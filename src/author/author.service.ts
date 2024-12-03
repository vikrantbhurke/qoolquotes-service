import { DeletionTracker } from "../global/utilities";
import { QuoteService } from "../quote";
import {
  CreateAuthorDTO,
  GetAuthorByNameDTO,
  GetAuthorsDTO,
  UpdateAuthorDTO,
} from "./dtos";
import { AuthorRepository } from "./index";

export class AuthorService {
  authorRepository: AuthorRepository;
  quoteService: QuoteService;
  deletionTracker: DeletionTracker;

  setAuthorRepository(authorRepository: AuthorRepository): void {
    this.authorRepository = authorRepository;
  }

  setQuoteService(quoteService: QuoteService): void {
    this.quoteService = quoteService;
  }

  setDeletionTracker(deletionTracker: DeletionTracker): void {
    this.deletionTracker = deletionTracker;
  }

  async createAuthor(createAuthorDTO: CreateAuthorDTO) {
    return await this.authorRepository.createAuthor(createAuthorDTO);
  }

  async countAuthorQuotes(aid: string) {
    return await this.quoteService.countAuthorQuotes({ authorId: aid });
  }

  async getAuthors(getAuthorsDTO: GetAuthorsDTO) {
    const { alpha, page, sort, order } = getAuthorsDTO;

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

    return await this.authorRepository.getAuthors(filters);
  }

  async getAuthorByName(getAuthorByName: GetAuthorByNameDTO) {
    return await this.authorRepository.getAuthorByName(getAuthorByName);
  }

  async searchAuthors(page: number, search: string) {
    return await this.authorRepository.searchAuthors(page, search);
  }

  async updateAuthorById(aid: string, updateAuthorDTO: UpdateAuthorDTO) {
    return await this.authorRepository.updateAuthorById(aid, updateAuthorDTO);
  }

  async deleteAuthorById(aid: string) {
    if (this.deletionTracker.has(aid)) return;
    this.deletionTracker.add(aid);

    const author = await this.authorRepository.deleteAuthorById(aid);

    let page = 0;

    while (true) {
      const quotesPage = await this.quoteService.getQuotesByAuthorId(page, {
        authorId: aid,
      });

      if (!quotesPage.content.length) break;

      for (const quote of quotesPage.content)
        await this.quoteService.deleteQuoteById(quote._id);

      if (quotesPage.lastPage) break;
      page++;
    }

    this.deletionTracker.remove(aid);

    return author;
  }
}

export const authorService = new AuthorService();
