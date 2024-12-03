import { Order } from "../global/enums";
import { PAGE_SIZE } from "../global/constants/constants";

export const getTopicsConfig = {
  sort: "name",
  order: Order.Asc,
  PAGE_SIZE,
};

export const searchTopicsConfig = {
  searchField: "name",
  sort: "name",
  order: Order.Asc,
  PAGE_SIZE,
};
