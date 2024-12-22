import { Order } from "../global/enums";
import { PAGE_SIZE } from "../global/constants/constants";

export const getQuotesByPlaylistIdConfig = {
  sort: "createdAt",
  order: Order.Ascending,
  PAGE_SIZE,
};

export const getPlaylistsByQuoteIdConfig = {
  sort: "createdAt",
  order: Order.Ascending,
  PAGE_SIZE,
};
