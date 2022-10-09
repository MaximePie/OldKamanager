import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import formidableMiddleware from 'express-formidable';
import resourcesRoutes from './routes/resources.js';
import gearRoutes from './routes/gears.js';
import shoppingRoutes from './routes/shopping.js';
import {url} from './database.js';
import sourcemap from "source-map-support";

sourcemap.install();

dotenv.config();
const { connect } = mongoose;

connect(url).then(() => {
  const app = express();

  app.use(cors());
  app.use(formidableMiddleware());

  app.use('/resources', resourcesRoutes);
  app.use('/gears', gearRoutes);
  app.use('/shopping', shoppingRoutes);

  app.listen(process.env.PORT || 4001, onServerStart);
});

/**
 * Triggered when the server has successfully started
 */
function onServerStart() {
  console.log('Connection au serveur réussie.');
}
