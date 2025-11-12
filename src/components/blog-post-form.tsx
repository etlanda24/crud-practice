"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import Link from "next/link";
import { Edit, PlusCircle, Calendar as CalendarIcon, Image as ImageIcon, ArrowLeft } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
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
  imageUrl: z.string().optional(),
  category: z.enum(["Technology", "Lifestyle", "Travel", "Food", "Business"]),
  priority: z.enum(["Low", "Medium", "High"]),
  isPublished: z.boolean().default(false),
  publishDate: z.date(),
});

type BlogPost = z.infer<typeof postSchema> & {
  id: string;
};

interface BlogPostFormProps {
  selectedPost?: BlogPost | null;
}

const getUuid = () => {
    if (typeof window !== 'undefined' && window.crypto) {
        return window.crypto.randomUUID();
    }
    return uuidv4();
}

export default function BlogPostForm({ selectedPost }: BlogPostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isClient, setIsClient] = useState(false);

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: selectedPost ? {
        ...selectedPost,
        publishDate: new Date(selectedPost.publishDate)
    } : {
      title: "",
      content: "",
      author: "",
      imageUrl: "",
      category: "Technology",
      priority: "Medium",
      isPublished: false,
      publishDate: new Date(),
    },
  });
  
  const imageUrlValue = form.watch("imageUrl");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("imageUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: z.infer<typeof postSchema>) => {
    if(!isClient) return;

    const storedPosts = localStorage.getItem("blog-posts");
    const posts: BlogPost[] = storedPosts ? JSON.parse(storedPosts).map((p: any) => ({...p, publishDate: new Date(p.publishDate)})) : [];

    if (selectedPost) {
      const updatedPosts = posts.map((p) =>
        p.id === selectedPost.id ? { ...p, ...values } : p
      );
      localStorage.setItem("blog-posts", JSON.stringify(updatedPosts));
      toast({
        title: "Success",
        description: `Post "${values.title}" has been updated.`,
      });
    } else {
      const newPost: BlogPost = {
        ...values,
        id: getUuid(),
      };
      localStorage.setItem("blog-posts", JSON.stringify([...posts, newPost]));
      toast({
        title: "Success",
        description: `Post "${values.title}" has been created.`,
      });
    }
    router.push('/');
  };

  return (
    <div className="space-y-6">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4"/>
        Back to Posts
      </Link>
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
                <FormItem><FormLabel htmlFor="title">Title</FormLabel><FormControl><Input id="title" placeholder="Your Post Title" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="content" render={({ field }) => (
                <FormItem><FormLabel htmlFor="content">Content</FormLabel><FormControl><Textarea id="content" placeholder="Write your blog post here..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="author" render={({ field }) => (
                <FormItem><FormLabel htmlFor="author">Author</FormLabel><FormControl><Input id="author" placeholder="e.g., John Doe" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="imageUrl" render={({ field }) => (
                 <FormItem>
                    <FormLabel htmlFor="imageUrl">Image</FormLabel>
                    <FormControl>
                        <Input 
                            id="imageUrl"
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            ref={fileInputRef}
                            className="file:text-foreground"
                        />
                    </FormControl>
                    {imageUrlValue && (
                        <div className="relative mt-4 aspect-video w-full max-w-sm">
                            <Image src={imageUrlValue} alt="Image preview" fill className="object-cover rounded-md border" />
                        </div>
                    )}
                    <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel htmlFor="category">Category</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger id="category"><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Technology">Technology</SelectItem><SelectItem value="Lifestyle">Lifestyle</SelectItem><SelectItem value="Travel">Travel</SelectItem><SelectItem value="Food">Food</SelectItem><SelectItem value="Business">Business</SelectItem></SelectContent></Select><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="priority" render={({ field }) => (
                <FormItem className="space-y-3"><FormLabel>Priority</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1"><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem id="priority-low" value="Low" /></FormControl><FormLabel htmlFor="priority-low" className="font-normal">Low</FormLabel></FormItem><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem id="priority-medium" value="Medium" /></FormControl><FormLabel htmlFor="priority-medium" className="font-normal">Medium</FormLabel></FormItem><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem id="priority-high" value="High" /></FormControl><FormLabel htmlFor="priority-high" className="font-normal">High</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="publishDate" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel htmlFor="publishDate">Publish Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button id="publishDate" variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
              )} />
               <FormField control={form.control} name="isPublished" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox id="isPublished" checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel htmlFor="isPublished">Publish Post</FormLabel><FormDescription>Make this post publicly visible.</FormDescription></div></FormItem>
              )} />
              <div className="flex gap-2 pt-2">
                <Button id="submit-post-button" type="submit" className="flex-grow">{selectedPost ? "Update Post" : "Add Post"}</Button>
                <Link href="/" passHref>
                  <Button id="cancel-button" variant="outline" type="button" className="w-full">Cancel</Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
