import React from 'react';
import PostPreview from './PostPreview';
import { useRecentPost } from '../hooks/blog/useRecentPost';
import { Link } from 'react-router-dom';
import { IPost } from '../interfaces';

function RecentPosts() {

    const posts: IPost[] = useRecentPost();

    return (
        <>
            <hr className="border-black border-t-2 mb-0 dark:border-white" />
            <h5 className="text-left font-bold mt-0 mb-2 text-black dark:text-white">Recent Posts</h5>
            <div className="flex flex-col space-y-4">
                {posts.map((post, index) => (
                    <Link key={post.id} to={`/post/${post.id}`}><PostPreview key={index} post={post} /></Link>
                ))}
            </div>

        </>
    );
}

export default RecentPosts;
