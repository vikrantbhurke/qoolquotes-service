import { deletionTracker } from "../global/utilities";
import { AuthorController } from "./author.controller";
import { authorService, AuthorService } from "./author.service";
import { authorRepository, AuthorRepository } from "./author.repository";
import { authorUtility, AuthorUtility } from "./author.utility";
import { quoteService } from "../quote";

authorService.setAuthorRepository(authorRepository);
authorService.setQuoteService(quoteService);
authorService.setDeletionTracker(deletionTracker);

export {
  authorService,
  authorRepository,
  authorUtility,
  AuthorController,
  AuthorService,
  AuthorRepository,
  AuthorUtility,
};
