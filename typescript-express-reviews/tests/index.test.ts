import dotenv from 'dotenv';
dotenv.config({
  path: '.env.test'
});

import { after, before, beforeEach } from 'mocha';
import connect from '../src/models/connect';
import mongoose from 'mongoose';

before(async function() {
  this.timeout(10000);

  await connect();

  // Make sure all collections are created in Stargate, _after_ calling
  // `connect()`. stargate-mongoose doesn't currently support buffering on
  // connection helpers.
  await Promise.all(Object.values(mongoose.models).map(Model => {
    return Model.createCollection();
  }));
});

// `deleteMany()` currently does nothing
/*beforeEach(async function clearDb() {
  this.timeout(30000);

  await Promise.all(Object.values(mongoose.models).map(Model => {
    return Model.deleteMany({});
  }));
});*/

after(async function() {
  this.timeout(30_000);
  await Promise.all(Object.values(mongoose.connection.models).map(async Model => {
    await mongoose.connection.dropCollection(Model.collection.collectionName);
  }));

  await mongoose.disconnect();
});
