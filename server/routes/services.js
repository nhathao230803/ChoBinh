import express from "express";
import Service from "../models/Service.js";

import { MessageResponse, DataResponse, Response, InternalErrorResponse, NotFoundResponse, ErrorResponse, UnAuthorizedResponse } from '../common/reponses.js'

const router = express.Router();

export default router;
