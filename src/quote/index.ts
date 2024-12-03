import { deletionTracker } from "../global/utilities";
import { QuoteController } from "./quote.controller";
import { quoteService, QuoteService } from "./quote.service";
import { quoteRepository, QuoteRepository } from "./quote.repository";
import { quoteUtility, QuoteUtility } from "./quote.utility";
import { authorService } from "../author";
import { topicService } from "../topic";
import { playlistQuoteService } from "../playlist-quote";
import { quoteLikerService } from "../quote-liker";
import { playlistService } from "../playlist";

quoteService.setQuoteRepository(quoteRepository);
quoteService.setQuoteUtility(quoteUtility);
quoteService.setAuthorService(authorService);
quoteService.setTopicService(topicService);
quoteService.setPlaylistService(playlistService);
quoteService.setPlaylistQuoteService(playlistQuoteService);
quoteService.setQuoteLikerService(quoteLikerService);
quoteService.setDeletionTracker(deletionTracker);

export {
  quoteService,
  quoteRepository,
  quoteUtility,
  QuoteController,
  QuoteService,
  QuoteRepository,
  QuoteUtility,
};
