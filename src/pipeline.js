import {map} from "bluebird";
import {isEmpty, partial} from "ramda";

import log from "./services/logger";
import {mongodb} from "./services/mongodb";
import upsertNotifications from "./steps/upsert-notifications";

export default async function pipeline (event) {
    log.info("Received notifications event", event);
    var element = event.data.element;
    const id = event.data.id;
    if (!element) {
        return null;
    }
    const usersId = element.usersId;
    if (isEmpty(usersId)) {
        return null;
    }
    const db = await mongodb;
    await map(usersId, partial(upsertNotifications, [element, id, db]));
    return null;
}