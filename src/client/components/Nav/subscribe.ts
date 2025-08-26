import { ref } from "vue";
import axios from "axios";

export async function subscribesFn(userData: any) {
  axios.get("/api/content/blogposts").then((response) => {
    const blogposts = response.data;
    const subscribes = userData.subscribes;

    const matchedPosts = blogposts.filter((blogPost: any) => {
      return subscribes.some((sub: any) => {
        const sameAuthor =
          String(blogPost.postAuthorID) === String(sub.subscribeTo);

        if (sameAuthor && Array.isArray(sub.posts)) {
          return sub.posts.some(
            (postEntry: any) =>
              String(postEntry.postID) === String(blogPost.postID) &&
              postEntry.isRead === false
          );
        }

        return false;
      });
    });

    const enrichedPosts = matchedPosts.map((post: any) => ({
      ...post,
      isRead: false,
      isClicked: false
    }));
    userData.notificationArray.push(...enrichedPosts);
  });
}
