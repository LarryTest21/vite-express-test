import mongoose from "mongoose";


const blogPostModel = new mongoose.Schema(
    {
        coverImage: {
            type: String,
        },
        lastUpload: {
            type: Date,
        },
        postAuthor: {
            type: String,
        },
        mainCategory: {
            type: String,
        },
        subCategory: {
            type: Array,
        },
        postContent: {
            type: String,
        },
        postDate: {
            type: String,
        },
        postExcerpt: {
            type: String,
        },
        postSection: {
            type: String,
        },
        postTitle: {
            type: String,
        }
    },
    { collection: "blogposts" }
);


const newsPostModel = new mongoose.Schema(
    {
        coverImage: {
            type: String,
        },
        lastUpload: {
            type: Date,
        },
        postAuthor: {
            type: String,
        },
 
        postContent: {
            type: String,
        },
        postDate: {
            type: String,
        },
        postExcerpt: {
            type: String,
        },
        postTitle: {
            type: String,
        }
    },
    { collection: "news" }
);

const blogPost = mongoose.model("blogPost", blogPostModel);
const newsPost = mongoose.model("newsPost", newsPostModel);



export { blogPost, newsPost };
