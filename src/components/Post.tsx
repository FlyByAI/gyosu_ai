import { useBlogPosts } from "../hooks/blog/useBlogPost";
import { Routes, Route, useParams } from 'react-router-dom';
import { IPost } from "../interfaces";
import { useRecentPost } from "../hooks/blog/useRecentPost";

// Post component
function Post() {

  const { postId } = useParams();

  const blogPosts: IPost[] = useRecentPost();

  const post = blogPosts.find((blogPost) => postId && parseInt(postId) == blogPost.id);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-transparent shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">{post?.title || ""}</h2>
      <p className="text-gray-500 text-sm mb-2">
        <span className="mr-2">{post?.author || ""}</span>
        <span>{post?.date || ""}</span>
      </p>
      <div className="text-gray-800 text-base text-left whitespace-pre-line dark:text-gray-200">
        {post?.body || ""}
      </div>
    </div>
  );
}
export default Post;
