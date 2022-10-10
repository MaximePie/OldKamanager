import {ObjectId} from "bson";
import {postOnServer} from "./server";

export type BulkUpdateParameters = {
    isInMarket?: boolean,
    isInInventory?: boolean,
    toBeCrafted?: 0 | 1,
    onWishList?: 0 | 1,
}

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
 * Update many gears
 * @param gearIds
 * @param parameters
 */
export async function bulkUpdate(gearIds: ObjectId[], parameters: BulkUpdateParameters) {
    return postOnServer('/gears/bulkUpdate/', {gearIds, parameters});
}