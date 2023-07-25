import PostPreview from "../components/PostPreview";
import { Link } from 'react-router-dom';
import GridContainer from "../components/grids/GridContainer";
import RecentPosts from "../components/RecentPosts";
import { IPost } from "../interfaces";
import { useRecentPost } from "../hooks/blog/useRecentPost";

export default function Blog() {

    const blogPosts: IPost[] = useRecentPost();

    return (
        <>

            <GridContainer
                left={
                    blogPosts.map((blogPost) => <Link key={blogPost.id} to={`/post/${blogPost.id}`}><PostPreview post={blogPost} /></Link>)
                }
                right={
                    <RecentPosts />
                } />
        </>
    );
}