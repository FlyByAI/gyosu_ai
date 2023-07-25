import { IPost } from "../interfaces";

interface PostPreviewProps {
  post: IPost;
}

function PostPreview({ post }: PostPreviewProps) {
  const { title, body, date } = post;
  const previewContent = body?.substring(0, 115) + "...";

  return (
    <div className="post-preview dark:bg-transparent">
      <h2 className="post-preview-title text-lg text-left text-black dark:text-white">{title}</h2>
      <p className="post-preview-content text-left text-gray-700 dark:text-gray-300">{previewContent}</p>
      <footer className="text-sm text-gray-500 text-left ml-2 dark:text-gray-400">{date}</footer>
    </div>
  );
}

export default PostPreview;
