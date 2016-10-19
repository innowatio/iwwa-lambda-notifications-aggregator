import {NOTIFICATION_COLLECTION_NAME} from "../config";

function getNotification (notification, id, userId) {
    return {
        _id: `${id}-${userId}`,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data || {},
        userId,
        date: new Date().getTime()
    };
}

export default async function (notificationElement, id, db, userId) {
    const notification = getNotification(notificationElement, id, userId);
    await db.collection(NOTIFICATION_COLLECTION_NAME).insert(notification);
}
