
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Edit, Trash2, PlusCircle, ImageIcon, Search, Calendar, User } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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


export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

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


  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const postTitle = posts.find(p => p.id === id)?.title;
    setPosts(posts.filter((p) => p.id !== id));
    toast({
        title: "Post Deleted",
        description: `Post "${postTitle}" has been removed.`,
    })
  };
  
  const filteredPosts = posts.filter(post => {
      return (
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (filterCategory === 'All' || post.category === filterCategory) &&
          (filterPriority === 'All' || post.priority === filterPriority)
      );
  }).sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());

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

        <Card id="filters-card">
            <CardHeader>
                <CardTitle>Filter & Search</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                    <label htmlFor="search-input" className="text-sm font-medium">Search Title</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="search-input"
                            placeholder="Search by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                 <div className="space-y-2">
                    <label htmlFor="category-filter" className="text-sm font-medium">Category</label>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger id="category-filter">
                            <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Categories</SelectItem>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                            <SelectItem value="Travel">Travel</SelectItem>
                            <SelectItem value="Food">Food</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <label htmlFor="priority-filter" className="text-sm font-medium">Priority</label>
                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                        <SelectTrigger id="priority-filter">
                            <SelectValue placeholder="Filter by priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Priorities</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>

       <Card id="posts-list-card">
          <CardHeader>
              <CardTitle>Your Posts</CardTitle>
              <CardDescription>Here you can see all your posts. You can edit or delete them.</CardDescription>
          </CardHeader>
          <CardContent>
               {filteredPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredPosts.map((p) => (
                      <Link href={`/posts/${p.id}`} key={p.id} className="group">
                        <Card id={`post-card-${p.id}`} className="flex flex-col h-full transition-all group-hover:shadow-lg group-hover:border-primary">
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
                                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                                  <User className="h-4 w-4" />
                                  <span>{p.author}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{format(p.publishDate, "PPP")}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-4">
                                <p className="line-clamp-3 text-sm">{p.content}</p>
                                <Separator />
                                  <div className="flex flex-wrap gap-2 items-center text-sm">
                                    <Badge variant="outline">{p.category}</Badge>
                                    <Badge variant={p.isPublished ? "default" : "secondary"}>
                                      {p.isPublished ? 'Published' : 'Draft'}
                                    </Badge>
                                     <span className={`font-semibold ${priorityColors[p.priority]}`}>{p.priority} Priority</span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Button id={`edit-post-${p.id}`} variant="outline" size="icon" asChild onClick={(e) => e.stopPropagation()}><Link href={`/posts/edit/${p.id}`}><Edit className="h-4 w-4" /><span className="sr-only">Edit</span></Link></Button>
                                <AlertDialog><AlertDialogTrigger asChild><Button id={`delete-post-${p.id}`} variant="destructive" size="icon" onClick={(e) => {e.stopPropagation(); e.preventDefault()}}><Trash2 className="h-4 w-4" /><span className="sr-only">Delete</span></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the post <strong className="font-medium">"{p.title}"</strong>. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={(e) => handleDelete(p.id, e)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                            </CardFooter>
                        </Card>
                      </Link>
                      ))}
                  </div>
              ) : (
                  <div id="no-posts-message" className="text-center text-muted-foreground py-10">
                      <p>No posts match the current filters.</p>
                      <p>Try adjusting your search or filter criteria.</p>
                  </div>
              )}
          </CardContent>
      </Card>
    </div>
  );
}

    
