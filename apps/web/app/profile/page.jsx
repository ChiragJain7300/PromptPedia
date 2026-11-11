"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/users/${session?.user.id}/posts`);
        const data = await response.json();

        setMyPosts(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error("Failed to fetch user posts:", error);
      }
    };

    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);

  const handleEdit = (post) => {
    const postId = post._id || post.id;
    router.push(`/update-prompt?id=${postId}`);
  };

  const handleDelete = async (post) => {
    const postId = post._id || post.id;
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed && postId) {
      try {
        await fetch(`/api/prompt/${postId}`, {
          method: "DELETE",
        });

        const filteredPosts = myPosts.filter(
          (item) => (item._id || item.id) !== postId
        );

        setMyPosts(filteredPosts);
      } catch (error) {
        console.error("Failed to delete prompt:", error);
      }
    }
  };

  return (
    <Profile
      name='My'
      desc='Welcome to your personalized profile page. Share your exceptional prompts and inspire others with the power of your imagination'
      data={myPosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
