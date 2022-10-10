import express from 'express';
import {
  get,
  fill,
  update,
  swapComponents,
  updateCraftingPrices,
  getPricesHistory,
  failAtSelling,
  deletePrice, updateMany
} from '../controllers/gear.js';
import Gear from "../models/Gear/Gear.js";
import moment from "moment";

const router = express.Router();

router.get('/', get);
router.get('/fill', fill);
router.get('/swapComponents', swapComponents);
router.get('/updateCraftingPrices', updateCraftingPrices);
router.post('/bulkUpdate', updateMany);
router.post('/update/:_id', update);
router.put('/fail/:_id', failAtSelling);
router.get('/prices/:_id', getPricesHistory);
router.delete('/prices/:_id', deletePrice);



export default router;
