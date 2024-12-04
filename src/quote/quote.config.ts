import { Order } from "../global/enums";
import { PAGE_SIZE } from "../global/constants/constants";

export const getRandomQuotesConfig = {
  refs: ["authorId", "topicIds"],
  refFields: ["name", "name"],
};

export const getQuotesByAuthorConfig = {
  refs: ["authorId", "topicIds"],
  refFields: ["name", "name"],
  sort: "content",
  order: Order.Asc,
  PAGE_SIZE,
};

export const getQuotesByTopicConfig = {
  refs: ["authorId", "topicIds"],
  refFields: ["name", "name"],
  sort: "content",
  order: Order.Asc,
  PAGE_SIZE,
};

export const searchQuotesConfig = {
  refs: ["authorId", "topicIds"],
  refFields: ["name", "name"],
  searchField: "content",
  sort: "content",
  order: Order.Asc,
  PAGE_SIZE,
};

export const getQuoteByIdConfig = {
  refs: ["authorId", "topicIds"],
  refFields: ["name", "name"],
  sort: "content",
  order: Order.Asc,
  PAGE_SIZE,
};
