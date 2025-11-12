
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import * as z from "zod";
import { ArrowLeft, Calendar, User, Tag, Shield, CheckCircle, XCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

const priorityColors: { [key: string]: string } = {
  Low: "text-green-600",
  Medium: "text-yellow-600",
  High: "text-red-600",
};

export default function PostDetailsPage() {
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
        const postToView = posts.find((p) => p.id === id);
        if (postToView) {
          setPost(postToView);
        } else {
          router.push("/");
        }
      }
    }
  }, [id, router, isClient]);

  if (!isClient || !post) {
    return (
      <div id="loading-spinner" className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <Link href="/" id="back-to-posts-link" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4"/>
        Back to Posts
      </Link>
      <Card id={`post-details-card-${post.id}`} className="overflow-hidden">
        {post.imageUrl && (
          <div className="relative w-full h-64 md:h-96">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-4xl font-extrabold tracking-tight">{post.title}</CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-base">
            <div id="author-info" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div id="date-info" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(post.publishDate, "PPP")}</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div id="post-content" className="prose prose-lg dark:prose-invert max-w-none text-foreground whitespace-pre-wrap">
            {post.content}
          </div>

          <Separator />
          
          <div id="post-meta" className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">Category</p>
                <Badge id="category-badge" variant="outline">{post.category}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                    <p className="font-semibold">Priority</p>
                    <p id="priority-text" className={`font-bold ${priorityColors[post.priority]}`}>{post.priority}</p>
                </div>
            </div>
             <div className="flex items-center gap-2">
              {post.isPublished ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="font-semibold">Status</p>
                <p id="status-text">{post.isPublished ? "Published" : "Draft"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
