import { AnalyticsItem } from "../../commerce/types.ts";
import { Runtime } from "../runtime.ts";
import { Cart, Item } from "../utils/client/types.ts";
import { state as storeState } from "./context.ts";

const { cart, loading } = storeState;

export const itemToAnalyticsItem = (
  item: Item & { quantity: number },
  index: number,
): AnalyticsItem => ({
  item_id: `${item.id}_${item.variant_sku}`,
  item_name: item.product_name,
  discount: item.price - item.variant_price,
  item_variant: item.variant_name.slice(item.product_name.length).trim(),
  // TODO: check
  price: item.price,
  // TODO
  // item_brand: "todo",
  index,
  quantity: item.quantity,
});

const wrap =
  <T>(action: (p: T, init?: RequestInit | undefined) => Promise<Cart>) =>
  (p: T) =>
    storeState.enqueue(async (signal) => ({
      cart: await action(p, { signal }),
    }));

const state = {
  cart,
  loading,
  addItem: wrap(
    Runtime.vnda.actions.cart.addItem,
  ),
  updateItem: wrap(
    Runtime.vnda.actions.cart.updateItem,
  ),
  setShippingAddress: wrap(
    Runtime.vnda.actions.cart.setShippingAddress,
  ),
  updateCoupon: wrap(
    Runtime.vnda.actions.cart.updateCoupon,
  ),
};

export const useCart = () => state;
