import {expect} from "chai";
import sinon from "sinon";

import {handler} from "index";
import {getMongoClient} from "services/mongodb";
import {run, getEventFromObject} from "../mocks";

const notificationElement = {
    type: "type",
    title: "title",
    message: "message",
    data: {
        dataItem: "item"
    },
    usersId: ["user1", "user2", "user3", "user4"]
};

describe("On notification event", () => {

    var db;
    var clock;
    var notificationsCollection;
    const date = new Date("2016-08-31").getTime();

    before(async () => {
        db = await getMongoClient();
        clock = sinon.useFakeTimers(date);
        await db.createCollection("notifications");
        notificationsCollection = db.collection("notifications");
    });

    after(async () => {
        await db.dropCollection("notifications");
        await db.close();
        clock.restore();
    });

    afterEach(async () => {
        await notificationsCollection.remove({});
    });

    it("perform insert of notification for all users added", async () => {
        const event = getEventFromObject({
            id: "eventId",
            data: {
                element: notificationElement,
                id: "c13b5bd9-3847-4765-b069-a1c3c35ea591"
            },
            type: "element inserted in collection notifications"
        });
        const expectedResult1 = {
            _id: "c13b5bd9-3847-4765-b069-a1c3c35ea591-user1",
            type: "type",
            title: "title",
            message: "message",
            data: {
                dataItem: "item"
            },
            userId: "user1",
            date
        };
        const expectedResult2 = {
            _id: "c13b5bd9-3847-4765-b069-a1c3c35ea591-user2",
            type: "type",
            title: "title",
            message: "message",
            data: {
                dataItem: "item"
            },
            userId: "user2",
            date
        };
        const expectedResult3 = {
            _id: "c13b5bd9-3847-4765-b069-a1c3c35ea591-user3",
            type: "type",
            title: "title",
            message: "message",
            data: {
                dataItem: "item"
            },
            userId: "user3",
            date
        };

        const expectedResult4 = {
            _id: "c13b5bd9-3847-4765-b069-a1c3c35ea591-user4",
            type: "type",
            title: "title",
            message: "message",
            data: {
                dataItem: "item"
            },
            userId: "user4",
            date
        };

        await run(handler, event);
        const notificationUser1 = await notificationsCollection.findOne({_id: "c13b5bd9-3847-4765-b069-a1c3c35ea591-user1"});
        expect(notificationUser1).to.deep.equal(expectedResult1);
        const notificationUser2 = await notificationsCollection.findOne({_id: "c13b5bd9-3847-4765-b069-a1c3c35ea591-user2"});
        expect(notificationUser2).to.deep.equal(expectedResult2);
        const notificationUser3 = await notificationsCollection.findOne({_id: "c13b5bd9-3847-4765-b069-a1c3c35ea591-user3"});
        expect(notificationUser3).to.deep.equal(expectedResult3);
        const notificationUser4 = await notificationsCollection.findOne({_id: "c13b5bd9-3847-4765-b069-a1c3c35ea591-user4"});
        expect(notificationUser4).to.deep.equal(expectedResult4);
    });

});
