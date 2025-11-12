"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { Edit, Trash2, PlusCircle, X, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  content: z.string().min(10, "Content must be at least 10 characters long."),
  author: z.string().min(2, "Author name is required."),
  category: z.enum(["Technology", "Lifestyle", "Travel", "Food", "Business"]),
  priority: z.enum(["Low", "Medium", "High"]),
  isPublished: z.boolean().default(false),
  publishDate: z.date(),
});

type BlogPost = z.infer<typeof postSchema> & {
  id: string;
};

// This is a workaround for the uuid package not working in some environments
const getUuid = () => {
    if (typeof window !== 'undefined' && window.crypto) {
        return window.crypto.randomUUID();
    }
    return uuidv4();
}

export default function BlogPostManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      author: "",
      category: "Technology",
      priority: "Medium",
      isPublished: false,
      publishDate: new Date(),
    },
  });

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

  const onSubmit = (values: z.infer<typeof postSchema>) => {
    if (selectedPost) {
      const updatedPosts = posts.map((p) =>
        p.id === selectedPost.id ? { ...p, ...values } : p
      );
      setPosts(updatedPosts);
      toast({
        title: "Success",
        description: `Post "${values.title}" has been updated.`,
      });
    } else {
      const newPost: BlogPost = {
        ...values,
        id: getUuid(),
      };
      setPosts([...posts, newPost]);
      toast({
        title: "Success",
        description: `Post "${values.title}" has been created.`,
      });
    }
    form.reset({
      title: "",
      content: "",
      author: "",
      category: "Technology",
      priority: "Medium",
      isPublished: false,
      publishDate: new Date(),
    });
    setSelectedPost(null);
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    form.reset(post);
  };

  const handleDelete = (id: string) => {
    const postTitle = posts.find(p => p.id === id)?.title;
    setPosts(posts.filter((p) => p.id !== id));
    toast({
        title: "Post Deleted",
        description: `Post "${postTitle}" has been removed.`,
    })
  };

  const cancelEdit = () => {
    setSelectedPost(null);
    form.reset({
      title: "",
      content: "",
      author: "",
      category: "Technology",
      priority: "Medium",
      isPublished: false,
      publishDate: new Date(),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-primary tracking-tight">Blog Post Manager</h1>
            <p className="text-muted-foreground">Create and manage your blog posts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card id="post-form-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                {selectedPost ? <Edit className="mr-2" /> : <PlusCircle className="mr-2" />}
                {selectedPost ? "Update Post" : "Create Post"}
              </CardTitle>
              <CardDescription>
                {selectedPost ? `Editing post: ${selectedPost.title}` : "Fill out the form to add a new post."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Your Post Title" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="content" render={({ field }) => (
                    <FormItem><FormLabel>Content</FormLabel><FormControl><Textarea placeholder="Write your blog post here..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="author" render={({ field }) => (
                    <FormItem><FormLabel>Author</FormLabel><FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Technology">Technology</SelectItem><SelectItem value="Lifestyle">Lifestyle</SelectItem><SelectItem value="Travel">Travel</SelectItem><SelectItem value="Food">Food</SelectItem><SelectItem value="Business">Business</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="priority" render={({ field }) => (
                    <FormItem className="space-y-3"><FormLabel>Priority</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1"><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Low" /></FormControl><FormLabel className="font-normal">Low</FormLabel></FormItem><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Medium" /></FormControl><FormLabel className="font-normal">Medium</FormLabel></FormItem><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="High" /></FormControl><FormLabel className="font-normal">High</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="publishDate" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Publish Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="isPublished" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Publish Post</FormLabel><FormDescription>Make this post publicly visible.</FormDescription></div></FormItem>
                  )} />
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" className="flex-grow">{selectedPost ? "Update Post" : "Add Post"}</Button>
                    {selectedPost && <Button variant="outline" type="button" onClick={cancelEdit}><X className="mr-2" /> Cancel</Button>}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
            <Card id="posts-list-card">
                <CardHeader>
                    <CardTitle>Blog Posts</CardTitle>
                    <CardDescription>View, edit, or delete your posts.</CardDescription>
                </CardHeader>
                <CardContent>
                     {posts.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Published</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {posts.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">{p.title}</TableCell>
                                    <TableCell>{p.category}</TableCell>
                                    <TableCell>{p.isPublished ? 'Yes' : 'No'}</TableCell>
                                    <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="icon" onClick={() => handleEdit(p)}><Edit className="h-4 w-4" /><span className="sr-only">Edit</span></Button>
                                        <AlertDialog><AlertDialogTrigger asChild><Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /><span className="sr-only">Delete</span></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the post <strong className="font-medium">"{p.title}"</strong>. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(p.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                                    </div>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-10">
                            <p>No posts created yet.</p>
                            <p>Use the form to add your first post.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
