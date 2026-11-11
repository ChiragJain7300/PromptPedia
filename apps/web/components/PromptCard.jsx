"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const PromptCard = ({ post, handleEdit, handleDelete, handleTagClick }) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  const [copied, setCopied] = useState("");

  const creator = post.creator || {};
  const creatorId = creator._id || creator.id || post.creatorId;
  const promptText = post.prompt || post.content || "";
  const postId = post._id || post.id;

  const handleProfileClick = () => {
    if (!creatorId) return;

    if (creatorId === session?.user.id) {
      return router.push("/profile");
    }

    router.push(`/profile/${creatorId}?name=${creator.username || "User"}`);
  };

  const handleCopy = () => {
    setCopied(promptText);
    navigator.clipboard.writeText(promptText);
    setTimeout(() => setCopied(""), 3000);
  };

  return (
    <div className='prompt_card'>
      <div className='flex justify-between items-start gap-5'>
        <div
          className='flex-1 flex justify-start items-center gap-3 cursor-pointer'
          onClick={handleProfileClick}
        >
          <Image
            src={creator.image || "/assets/images/logo.svg"}
            alt={creator.username || "user_image"}
            width={40}
            height={40}
            className='rounded-full object-contain'
          />

          <div className='flex flex-col'>
            <h3 className='font-satoshi font-semibold text-gray-900'>
              {creator.username || "Anonymous"}
            </h3>
            <p className='font-inter text-sm text-gray-500'>
              {creator.email || ""}
            </p>
          </div>
        </div>

        <div className='copy_btn' onClick={handleCopy}>
          <Image
            src={
              copied === promptText
                ? "/assets/icons/tick.svg"
                : "/assets/icons/copy.svg"
            }
            alt={copied === promptText ? "tick_icon" : "copy_icon"}
            width={12}
            height={12}
          />
        </div>
      </div>

      {post.title && (
        <h4 className='mt-2 font-satoshi font-bold text-gray-800 text-base'>
          {post.title}
        </h4>
      )}

      <p className='my-3 font-satoshi text-sm text-gray-700'>{promptText}</p>
      <p
        className='font-inter text-sm blue_gradient cursor-pointer'
        onClick={() => handleTagClick && handleTagClick(post.tag)}
      >
        #{post.tag}
      </p>

      {session?.user.id === creatorId && pathName === "/profile" && (
        <div className='mt-5 flex-center gap-4 border-t border-gray-100 pt-3'>
          <p
            className='font-inter text-sm green_gradient cursor-pointer'
            onClick={handleEdit}
          >
            Edit
          </p>
          <p
            className='font-inter text-sm orange_gradient cursor-pointer'
            onClick={handleDelete}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptCard;
