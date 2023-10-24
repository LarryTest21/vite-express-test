import { Request, Response } from "express";
import { blogPost, newsPost } from "../models/posts"


export async function getAllBlog(req: Request, res: Response) {
  await blogPost.find()
    //@ts-ignore

    .then((data) => {
      res.json(data);
    })
    //@ts-ignore

    .catch((err) => {
      res.status(404).json({ success: false, message: "No users were found" });
    });
}

export async function getBlog(req: Request, res: Response) {

  blogPost.findOne({ _id: req.params.id })
    .then((post:any) => {
      res.json(post)
    })
    //@ts-ignore

    .catch((err) => {
      res.status(404).json({ success: false, message: "No users were found" });
    });
}




export async function getAllNews(req: Request, res: Response) {
  await newsPost.find()
    //@ts-ignore

    .then((data) => {
      res.json(data);
    })
    //@ts-ignore

    .catch((err) => {
      res.status(404).json({ success: false, message: "No users were found" });
    });
}


export async function getNews(req: Request, res: Response) {
  await newsPost.findById(req.params.id)
    //@ts-ignore

    .then((data) => {
      res.json(data);
    })
    //@ts-ignore

    .catch((err) => {
      res.status(404).json({ success: false, message: "No users were found" });
    });
}

