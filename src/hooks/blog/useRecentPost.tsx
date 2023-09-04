import { useState, useEffect } from 'react';
import { notSecretConstants } from '../../constants/notSecretConstants';

export const useRecentPost = () => {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch(`${window.location.href.includes("https://test.gyosu.ai")
          ? notSecretConstants.testDjangoApi
          : import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/blogposts/recent`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBlogPosts(data);
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      }
    };

    fetchBlogPosts();
  }, []);

  return blogPosts;
};