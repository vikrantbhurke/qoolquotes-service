import { PAGE_SIZE } from "../global/constants/constants";
import { Order } from "../global/enums";

export const getUserByIdConfig = {};

export const getUsersByUsernameConfig = {
  sort: "firstname",
  order: Order.Asc,
  PAGE_SIZE,
};
