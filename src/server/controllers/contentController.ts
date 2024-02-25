import { Request, Response } from "express";
import { blogPost, newsPost } from "../models/posts";
import { eventPost } from "../models/event";
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

  if (postData.event === true) {
    console.log(postData);

    const newsEventData = {
      eventTitle: req.body.eventTitle,
      eventDate: req.body.eventDate,
      eventCategory: req.body.eventCategory,
      eventImage: req.body.eventImage,
    };

    eventPost.create(newsEventData).then((result) => {
      res.status(200).json({ succes: true, data: newsEventData });
    });
  } else {
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
      blogPost.create(blogPostData).then((result) => {
        res.status(200).json({ succes: true, data: blogPostData });
      });
    }
  }
}

export async function getAllEvents(req: Request, res: Response) {
  eventPost
    .find()
    .then((post: any) => {
      res.json(post);
    })
    //@ts-ignore

    .catch((err) => {
      res.status(404).json({ success: false, message: "No events were found" });
    });
}

export async function getEvent(req: Request, res: Response) {
  eventPost
    .findOne({ _id: req.params.id })
    .then((event: any) => {
      res.json(event);
    })
    //@ts-ignore

    .catch((err) => {
      res.status(404).json({ success: false, message: "Event wasn't found" });
    });
}
export async function updateEvent(req: Request, res: Response) {

console.log(req.params)
console.log(req.body)
if(req.body['event']===true){
  const updatedEventData = req.body; 

  console.log(updatedEventData)
  eventPost
    .findOneAndUpdate(
      { _id: req.params.id },
      {
        $set:{
          eventTitle: updatedEventData.eventTitle,
          eventImage: updatedEventData.eventImage,
          eventCategory: updatedEventData.eventCategory,
          eventDate: updatedEventData.eventDate,
          eventText: updatedEventData.eventText
        },
      }
    )
    .then((event: any) => {
      res.json(event);
    })
    //@ts-ignore

    .catch((err) => {
      res.status(404).json({ success: false, message: "Event wasn't found" });
    });
} else if (req.body['type']==="blogpost"){

}


}

