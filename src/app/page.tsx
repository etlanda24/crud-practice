"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Edit, Trash2, PlusCircle, ImageIcon } from "lucide-react";
import { format } from "date-fns";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

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

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        const storedPosts = localStorage.getItem("blog-posts");
        if (storedPosts) {
          const parsedPosts = JSON.parse(storedPosts).map((post: any) => ({
            ...post,
            publishDate: new Date(post.publishDate),
          }));
          setPosts(parsedPosts);
        }
      } catch (error) {
        console.error("Failed to load posts from localStorage", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load saved posts.",
        });
      }
    }
  }, [isClient, toast]);

    useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem("blog-posts", JSON.stringify(posts));
      } catch (error) {
        console.error("Failed to save posts to localStorage", error);
      }
    }
  }, [posts, isClient]);


  const handleDelete = (id: string) => {
    const postTitle = posts.find(p => p.id === id)?.title;
    setPosts(posts.filter((p) => p.id !== id));
    toast({
        title: "Post Deleted",
        description: `Post "${postTitle}" has been removed.`,
    })
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-primary tracking-tight">Blog Posts</h1>
            <p className="text-muted-foreground">View, create, and manage your blog posts.</p>
        </div>
        <Link href="/posts/new">
          <Button id="add-new-post-button">
            <PlusCircle className="mr-2" />
            Add New Post
          </Button>
        </Link>
      </div>

       <Card id="posts-list-card">
          <CardHeader>
              <CardTitle>Your Posts</CardTitle>
              <CardDescription>Here you can see all your posts. You can edit or delete them.</CardDescription>
          </CardHeader>
          <CardContent>
               {posts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {posts.map((p) => (
                      <Card key={p.id} id={`post-card-${p.id}`} className="flex flex-col">
                          <CardHeader>
                              {p.imageUrl ? (
                                  <div className="relative aspect-video w-full mb-4">
                                      <Image src={p.imageUrl} alt={p.title} fill className="object-cover rounded-md border" />
                                  </div>
                              ) : (
                                  <div className="flex items-center justify-center aspect-video w-full mb-4 bg-muted rounded-md border">
                                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                                  </div>
                              )}
                              <CardTitle>{p.title}</CardTitle>
                              <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground pt-1">
                                  <Badge variant="outline">{p.category}</Badge>
                                  <span className={p.isPublished ? "text-green-600" : "text-amber-600"}>{p.isPublished ? 'Published' : 'Draft'}</span>
                              </div>
                          </CardHeader>
                          <CardContent className="flex-grow">
                              <p className="line-clamp-3 text-sm">{p.content}</p>
                          </CardContent>
                          <CardFooter className="flex justify-end gap-2">
                              <Link href={`/posts/edit/${p.id}`}>
                                <Button id={`edit-post-${p.id}`} variant="outline" size="icon"><Edit className="h-4 w-4" /><span className="sr-only">Edit</span></Button>
                              </Link>
                              <AlertDialog><AlertDialogTrigger asChild><Button id={`delete-post-${p.id}`} variant="destructive" size="icon"><Trash2 className="h-4 w-4" /><span className="sr-only">Delete</span></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the post <strong className="font-medium">"{p.title}"</strong>. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(p.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                          </CardFooter>
                      </Card>
                      ))}
                  </div>
              ) : (
                  <div id="no-posts-message" className="text-center text-muted-foreground py-10">
                      <p>No posts created yet.</p>
                      <p>Click "Add New Post" to get started.</p>
                  </div>
              )}
          </CardContent>
      </Card>
    </div>
  );
}
