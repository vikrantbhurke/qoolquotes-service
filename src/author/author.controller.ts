import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  QueryParams,
  Res,
} from "routing-controllers";
import {
  AuthorService,
  authorService,
  AuthorUtility,
  authorUtility,
} from "./index";
import { AuthorResponseDTO, GetAuthorsDTO, UpdateAuthorDTO } from "./dtos";
import { Page } from "../global/types/page.type";
import { Response } from "express";

@Controller("/authors")
export class AuthorController {
  authorService: AuthorService;
  authorUtility: AuthorUtility;

  constructor() {
    this.authorService = authorService;
    this.authorUtility = authorUtility;
  }

  @Get("/:aid/quotes")
  async countAuthorQuotes(
    @Param("aid") aid: string,
    @Res() response: Response
  ) {
    try {
      const count = await this.authorService.countAuthorQuotes(aid);
      return response.status(200).json({ count });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get()
  async getAuthors(
    @QueryParams() getAuthorsDTO: GetAuthorsDTO,
    @Res() response: Response
  ) {
    try {
      const authorsPage: Page = await this.authorService.getAuthors(
        getAuthorsDTO
      );

      const authorsDTO: AuthorResponseDTO[] = authorsPage.content.map(
        (author) => this.authorUtility.convertAuthorToAuthorDTO(author)
      );

      const authorsPageDTO: Page = {
        ...authorsPage,
        content: authorsDTO,
      };

      return response.status(200).json(authorsPageDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/search/:search")
  async searchAuthors(
    @QueryParams() { page }: GetAuthorsDTO,
    @Param("search") search: string,
    @Res() response: Response
  ) {
    try {
      const authorsPage: Page = await this.authorService.searchAuthors(
        page,
        search
      );

      const authorsDTO: AuthorResponseDTO[] = authorsPage.content.map(
        (author) => this.authorUtility.convertAuthorToAuthorDTO(author)
      );

      const authorsPageDTO: Page = {
        ...authorsPage,
        content: authorsDTO,
      };

      return response.status(200).json(authorsPageDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Patch("/:aid")
  async updateAuthorById(
    @Param("aid") aid: string,
    @Body() updateAuthorDTO: UpdateAuthorDTO,
    @Res() response: Response
  ) {
    try {
      await this.authorService.updateAuthorById(aid, updateAuthorDTO);
      return response.status(200).send({ message: "Author updated." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Delete("/:aid")
  async deleteAuthorById(@Param("aid") aid: string, @Res() response: Response) {
    try {
      await this.authorService.deleteAuthorById(aid);
      return response.status(200).send({ message: "Author deleted." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }
}
