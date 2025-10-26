import { Request, Response } from "express";
import { visitorsAnalytics } from "../models/analyticsVisitor";
import { pagesAnalytics } from "../models/analyticsPages";
import { pagesByDay } from "../models/analyticsPagesDate";
import { logOut } from "./authController";
let mongoose = require("mongoose");

export async function getAnalytics(req: Request, res: Response) {

      res.status(200).json({ success: true });

}
