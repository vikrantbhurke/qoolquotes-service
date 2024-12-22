import {
  searchModels,
  getModelByField,
  getModelsByFieldDynamic,
} from "../global/decorators/read";
import Author from "./author.model";
import { createModel } from "../global/decorators/create";
import { updateModelById } from "../global/decorators/update";
import { deleteModelById } from "../global/decorators/delete";
import { CreateAuthorDTO, NameDTO, UpdateAuthorDTO } from "./dtos";
import { getAuthorsDynamicConfig, searchAuthorsConfig } from "./author.config";

export class AuthorRepository {
  @createModel(Author)
  async createAuthor(createAuthorDTO: CreateAuthorDTO, author?: any) {
    return author;
  }

  @getModelsByFieldDynamic(Author, getAuthorsDynamicConfig)
  async getAuthors(getAuthorsDTO: any, fieldObj: any, authorsPage?: any) {
    return authorsPage;
  }

  @getModelByField(Author, {})
  async getAuthorByName(nameDTO: NameDTO, author?: any) {
    return author;
  }

  @searchModels(Author, searchAuthorsConfig)
  async searchAuthors(page: number, search: string, authorsPage?: any) {
    return authorsPage;
  }

  @updateModelById(Author)
  async updateAuthorById(
    aid: string,
    updateAuthorDTO: UpdateAuthorDTO,
    author?: any
  ) {
    return author;
  }

  @deleteModelById(Author)
  async deleteAuthorById(aid: string, author?: any) {
    return author;
  }
}

export const authorRepository = new AuthorRepository();
