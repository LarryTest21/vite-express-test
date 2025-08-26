import { Request, Response } from "express";
import { blogPost, newsPost } from "../models/posts";
import { eventPost } from "../models/event";
import { User } from "../models/user";

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
  console.log(postData);
  if (postData.event === true) {
    const newsEventData = {
      eventID: req.body.id,
      eventTitle: req.body.eventTitle,
      eventDate: req.body.eventDate,
      eventCategory: req.body.eventCategory,
      eventImage: req.body.eventImage,
      postAuthorID: req.body.postAuthorID,
    };

    eventPost
      .create(newsEventData)
      .then((result) => {
        res.status(200).json({ succes: true, data: newsEventData });
      })
      .then(() => {
        User.findOneAndUpdate(
          { _id: req.body.postAuthorID },
          { $push: { createdEvents: req.body.id } }
        );
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    if (postData.mainCategory[0] === "News") {
      const newsPostData = {
        postID: postData.postID,
        coverImage: postData.postImage,
        lastUpload: new Date(),
        postAuthorID: postData.postAuthorID,
        mainCategory: postData.mainCategory[0],
        postContent: postData.postContent,
        postDate: postData.postDate,
        postExcerpt: postData.postExcerpt,
        postTitle: postData.postTitle,
      };
      console.log(newsPostData);
      newsPost
        .create(newsPostData)
        .then((result) => {
          res.status(200).json({ succes: true, data: newsPostData });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else if (req.body.mainCategory[0] === "Blog") {
      console.log("Blog post upload");

      try {
        const existingPost = await blogPost.findOne({
          postID: postData.postID,
        });
        console.log(postData.postID);
        const blogPostData = {
          postID: postData.postID,
          coverImage: postData.postImage,
          lastUpload: new Date(),
          postAuthorID: postData.postAuthorID,
          mainCategory: postData.mainCategory[0],
          subCategory: postData.subCategory,
          postContent: postData.postContent,
          postDate: postData.postDate,
          postExcerpt: postData.postExcerpt,
          postTitle: postData.postTitle,
        };

        if (existingPost === null) {
          const result = await blogPost.create(blogPostData);
          return res.status(200).json({ success: true, data: result });
        } else {
          console.log("Post already exists, updating instead");
          return res
            .status(205)
            .json({ success: false, message: "Post already exists" });
        }
      } catch (err) {
        console.error("Error uploading blog post:", err);
        return res.status(500).json({ success: false });
      }
    }
  }
}

export async function getPostAuthorName(req: Request, res: Response) {
  const postAuthorID = req.params.id;
  console.log(postAuthorID);
  await User.findOne({ _id: postAuthorID })
    .then((user: any) => {
      res.json(user);
    })

    //@ts-ignore

    .catch((err) => {
      res.json(err);
    });
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
  console.log(req.params);
  console.log(req.body);
  if (req.body["event"] === true) {
    const updatedEventData = req.body;

    console.log(updatedEventData);
    eventPost
      .findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            eventTitle: updatedEventData.eventTitle,
            eventImage: updatedEventData.eventImage,
            eventCategory: updatedEventData.eventCategory,
            eventDate: updatedEventData.eventDate,
            eventText: updatedEventData.eventText,
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
  } else if (req.body["type"] === "blogpost") {
  }
}

export async function updateAuthor(req: Request, res: Response) {
  const authorID = req.params.id;
  const postID = req.body.postID;

  User.find({ _id: authorID }).then((result) => {
    const prevPosts = result[0].postsWritten;

    if (prevPosts == null || undefined) {
      User.findOneAndUpdate(
        { _id: authorID },
        {
          $set: {
            postsWritten: [postID],
          },
        }
      )
        .then((result) => {
          res.status(200).json({ success: true, data: result });
        })
        .catch((err) => {
          res.status(400).json({ success: false, error: err });
        });
    } else {
      console.log();

      User.findOneAndUpdate(
        { _id: authorID },
        { $push: { postsWritten: postID } }
      )
        .then((result) => {
          res.status(200).json({ success: true, data: result });
        })
        .catch((err) => {
          res.status(400).json({ success: false, error: err });
        });
    }
  });
}

export async function updateSubscribers(req: Request, res: Response) {
  try {
    const postAuthorID = req.body.postAuthorID;
    const postID = req.body.postID;

    // Find user where the post is NOT already present
    const user = await User.findOne({
      "subscribes.subscribeTo": postAuthorID,
      "subscribes.posts.postID": { $ne: postID },
    });

    if (!user) {
      return res
        .status(409)
        .json({ error: "Duplicate postID for this subscription" });
    }

    // Update the user with the new post entry
    const result = await User.updateOne(
      { "subscribes.subscribeTo": postAuthorID },
      {
        $push: {
          "subscribes.$.posts": {
            postID: postID,
            isRead: false,
          },
        },
      }
    );

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(400).json({ success: false, error: err });
  }
}
