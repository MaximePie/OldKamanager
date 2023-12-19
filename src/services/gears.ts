import { ObjectId } from "bson";
import { postOnServer } from "./server";

export type BulkUpdateParameters = {
  isInMarket?: boolean;
  isInInventory?: boolean;
  toBeCrafted?: 0 | 1;
  onWishList?: 0 | 1;
};

// get BulkUpdateParameters property names
export function getBulkUpdateParametersPropertyNames(): string[] {
  return Object.keys({
    isInMarket: true,
    isInInventory: true,
    toBeCrafted: 0,
    onWishList: 0,
  });
}

/**
 * Update many gears with the same value
 * @param gearIds
 * @param parameters
 */
export async function bulkUpdate(
  gearIds: ObjectId[],
  parameters: BulkUpdateParameters
) {
  return postOnServer("/gears/bulkUpdate/", { gearIds, parameters });
}

export async function sellMany(gearIds: ObjectId[]) {
  return postOnServer("/gears/sellMany/", { gearIds });
}

/**
 * Check if the gear has been recently updated (7 days)
 * @param lastPriceUpdatedAt
 */
export function hasBeenRecentlyUpdated(lastPriceUpdatedAt: Date): boolean {
  // If has been updated in the last hour
  return (
    lastPriceUpdatedAt &&
    new Date(lastPriceUpdatedAt).getTime() >
      Date.now() - 7 * 24 * 60 * 60 * 1000
  );
}
