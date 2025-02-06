import {
  quoteIndexRepository,
  QuoteIndexRepository,
} from "./quote-index.repository";
import { quoteIdService } from "../quote-id";
import { quoteIndexService, QuoteIndexService } from "./quote-index.service";

quoteIndexService.setQuoteIndexRepository(quoteIndexRepository);
quoteIndexService.setQuoteIdService(quoteIdService);

export {
  quoteIndexService,
  quoteIndexRepository,
  QuoteIndexService,
  QuoteIndexRepository,
};
