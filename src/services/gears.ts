import {ObjectId} from "bson";
import {postOnServer} from "./server";

export type BulkUpdateParameters = {
    isInMarket?: boolean,
    isInInventory?: boolean,
}

/**
 * Update many gears
 * @param gearIds
 * @param parameters
 */
export async function bulkUpdate(gearIds: ObjectId[], parameters: BulkUpdateParameters) {
    return postOnServer('/gears/bulkUpdate/', {gearIds, parameters});
}