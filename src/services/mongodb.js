import {MongoClient} from "mongodb";

import {MONGODB_URL} from "../config";

export const mongodb = MongoClient.connect(MONGODB_URL);
