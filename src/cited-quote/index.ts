import { CitedQuoteController } from "./cited-quote.controller";
import { citedQuoteService, CitedQuoteService } from "./cited-quote.service";
import {
  citedQuoteRepository,
  CitedQuoteRepository,
} from "./cited-quote.repository";
import { quoteService } from "../quote";

citedQuoteService.setCitedQuoteRepository(citedQuoteRepository);
citedQuoteService.setQuoteService(quoteService);

export {
  citedQuoteService,
  citedQuoteRepository,
  CitedQuoteController,
  CitedQuoteService,
  CitedQuoteRepository,
};
