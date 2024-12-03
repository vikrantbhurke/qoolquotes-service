import { PAGE_SIZE } from "../global/constants/constants";
import { Order } from "../global/enums";

export const getPlaylistsConfig = {
  refs: ["creatorId"],
  refFields: [" profilepic firstname lastname username"],
  sort: "createdAt",
  order: Order.Desc,
  PAGE_SIZE,
};

export const searchPlaylistsConfig = {
  refs: ["creatorId"],
  refFields: [" profilepic firstname lastname username"],
  searchField: "name",
  sort: "createdAt",
  order: Order.Desc,
  PAGE_SIZE,
};

export const getPlaylistsByCreatorIdConfig = {
  refs: ["creatorId"],
  refFields: [" profilepic firstname lastname username"],
  sort: "createdAt",
  order: Order.Desc,
  PAGE_SIZE,
};

export const getPlaylistByIdConfig = {
  refs: ["creatorId"],
  refFields: [" profilepic firstname lastname username"],
};
