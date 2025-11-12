"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import BlogPostForm from "@/components/blog-post-form";
import * as z from "zod";

const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  content: z.string().min(10, "Content must be at least 10 characters long."),
  author: z.string().min(2, "Author name is required."),
  imageUrl: z.string().optional(),
  category: z.enum(["Technology", "Lifestyle", "Travel", "Food", "Business"]),
  priority: z.enum(["Low", "Medium", "High"]),
  isPublished: z.boolean().default(false),
  publishDate: z.date(),
});

type BlogPost = z.infer<typeof postSchema> & {
  id: string;
};

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && id) {
      const storedPosts = localStorage.getItem("blog-posts");
      if (storedPosts) {
        const posts: BlogPost[] = JSON.parse(storedPosts).map((p: any) => ({
          ...p,
          publishDate: new Date(p.publishDate),
        }));
        const postToEdit = posts.find((p) => p.id === id);
        if (postToEdit) {
          setPost(postToEdit);
        } else {
          router.push("/");
        }
      }
    }
  }, [id, router, isClient]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return <BlogPostForm selectedPost={post} />;
}
