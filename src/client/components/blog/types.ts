export interface ReplyInterface {
  replyID: number;
  replyContent: string;
  replyDate: string;
  profilePic: string;
  displayName: string;
  replyWriterID: number;
  replies: ReplyInterface[]; // recursive replies
  thumbsupIDs: string[];
  replyToReplyID?: number;
  replyToReplyName?: string;
}

export interface CommentInterface {
  commentID: number;
  commentContent: string;
  commentDate: string;
  profilePic: string;
  displayName: string;
  commentWriterID: number;
  replies: ReplyInterface[]; // ✅ now correctly typed
  thumbsupIDs: string[];
}
export interface CommentNode {
  commentID: number;
  commentContent: string;
  commentDate: string;
  profilePic: string;
  displayName: string;
  commentWriterID: string;
  replies?: CommentNode[]; // recursive nesting
  thumbsupIDs: string[];
  replyToCommentID?: number;
  replyToCommentName?: string;

  // NEW fields for your requested behavior:
  commentLevel?: 1 | 2 | 3;        // 1 = main, 2 = reply-to-main, 3 = reply-to-reply
  parentCommentID?: number | null; // null for root-level comments
}
