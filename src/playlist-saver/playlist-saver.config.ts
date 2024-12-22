import { Order } from "../global/enums";
import { PAGE_SIZE } from "../global/constants/constants";

export const getPlaylistBySaverIdConfig = {
  sort: "createdAt",
  order: Order.Descending,
  PAGE_SIZE,
};
