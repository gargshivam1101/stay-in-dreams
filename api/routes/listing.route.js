import express from "express";
import {
  createListing,
  deleteListing,
  getListing,
  updateListing,
  getListings,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const listingRouter = express.Router();

listingRouter.post("/create", verifyToken, createListing);
listingRouter.delete("/delete/:id", verifyToken, deleteListing);
listingRouter.post("/update/:id", verifyToken, updateListing);
listingRouter.get("/get/:id", getListing);
listingRouter.get("/get", getListings);

export default listingRouter;
