import { QuoteLikerController } from "./quote-liker.controller";
import { quoteLikerService, QuoteLikerService } from "./quote-liker.service";
import {
  quoteLikerRepository,
  QuoteLikerRepository,
} from "./quote-liker.repository";

quoteLikerService.setQuoteLikerRepository(quoteLikerRepository);

export {
  quoteLikerService,
  quoteLikerRepository,
  QuoteLikerController,
  QuoteLikerService,
  QuoteLikerRepository,
};
