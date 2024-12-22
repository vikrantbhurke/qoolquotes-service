import { Order } from "../global/enums";
import { PAGE_SIZE } from "../global/constants/constants";

export const getAuthorsDynamicConfig = {
  PAGE_SIZE,
};

export const searchAuthorsConfig = {
  searchField: "name",
  sort: "name",
  order: Order.Ascending,
  PAGE_SIZE,
};
