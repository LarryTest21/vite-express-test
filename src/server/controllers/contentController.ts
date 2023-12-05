import { Request, Response } from "express";
import { blogPost, newsPost } from "../models/posts";

export async function getAllBlog(req: Request, res: Response) {
  await blogPost
    .find()
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
  blogPost
    .findOne({ _id: req.params.id })
    .then((post: any) => {
      res.json(post);
    })
    //@ts-ignore

    .catch((err) => {
      res.status(404).json({ success: false, message: "No users were found" });
    });
}

export async function getAllNews(req: Request, res: Response) {
  await newsPost
    .find()
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
  await newsPost
    .findById(req.params.id)
    //@ts-ignore

    .then((data) => {
      res.json(data);
    })
    //@ts-ignore

    .catch((err) => {
      res.status(404).json({ success: false, message: "No users were found" });
    });
}

export async function uploadPost(req: Request, res: Response) {
  const postData = req.body;
  if (postData.mainCategory[0] === "News") {
    const newsPostData = {
      coverImage: postData.coverImage,
      lastUpload: new Date(),
      postAuthor: postData.author,
      mainCategory: postData.mainCategory[0],
      subCategory: postData.subategory,
      postContent: postData.postContent,
      postDate: postData.postDate,
      postExcerpt: postData.excerpt,
      postTitle: postData.postTitle,
    };

    newsPost.create(newsPostData).then((result) => {
      res.status(200).json({ succes: true, data: newsPostData });
    });
  } else if (req.body.mainCategory[0] === "Blog") {
    const blogPostData = {
      coverImage: postData.coverImage,
      lastUpload: new Date(),
      postAuthor: postData.author,
      mainCategory: postData.mainCategory[0],
      subCategory: postData.subCategory,
      postContent: postData.postContent,
      postDate: postData.postDate,
      postExcerpt: postData.excerpt,
      postTitle: postData.postTitle,
    };
console.log(`output->blogPostData`,blogPostData)
    blogPost.create(blogPostData).then((result) => {
      res.status(200).json({ succes: true, data: blogPostData });
    });
  }
}
