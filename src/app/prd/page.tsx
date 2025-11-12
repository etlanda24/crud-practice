
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PRDPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
        <Link href="/" id="back-to-posts-link" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4"/>
            Back to Posts
        </Link>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">Product Requirements Document</h1>
        <p className="text-xl text-muted-foreground">Simple Blog Post Manager</p>
      </div>

      <section id="introduction">
        <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
        <p className="text-foreground/90">
          This document outlines the product requirements for the "Simple Blog Post Manager," a web application designed for creating, managing, and viewing blog posts. It is a client-side application built with Next.js and React, utilizing the browser's local storage for data persistence. This approach eliminates the need for a backend database, making it a lightweight and standalone tool perfect for individual users, writers, and developers looking for a practical CRUD application example.
        </p>
      </section>

      <section id="vision-goals">
        <h2 className="text-2xl font-semibold mb-2">2. Vision & Goals</h2>
        <ul className="list-disc pl-5 space-y-1 text-foreground/90">
          <li><strong>Product Vision:</strong> To provide an intuitive, clean, and efficient interface for managing personal blog content without the overhead of a complex technical setup.</li>
          <li><strong>Primary Goal:</strong> Enable users to seamlessly perform all CRUD (Create, Read, Update, Delete) operations on blog posts.</li>
          <li><strong>Secondary Goal:</strong> Serve as a high-quality technical showcase, demonstrating a rich variety of form controls and modern React development patterns within a real-world application context.</li>
        </ul>
      </section>
      
      <section id="target-audience">
        <h2 className="text-2xl font-semibold mb-2">3. Target Audience</h2>
         <ul className="list-disc pl-5 space-y-1 text-foreground/90">
            <li><strong>The Content Creator/Blogger:</strong> Individuals who need a simple tool to draft and organize their posts before publishing them on a primary platform. They value ease of use and a distraction-free writing environment.</li>
            <li><strong>The Developer/Student:</strong> Programmers and students who want a practical, well-structured example of a modern front-end application. They are interested in the implementation of features like complex forms, client-side routing, and state management in Next.js.</li>
        </ul>
      </section>

      <section id="features">
        <h2 className="text-2xl font-semibold mb-4">4. Core Features & Functional Requirements</h2>
        <Card>
          <CardContent className="p-0">
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Feature ID</TableHead>
                  <TableHead>Feature Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Key Element IDs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>F-01</TableCell>
                  <TableCell>View All Posts</TableCell>
                  <TableCell>The main page (`/`) will display all created blog posts in a card-based grid. Each card will show key post details.</TableCell>
                  <TableCell className="font-mono text-xs">`posts-list-card`, `post-card-&#123;id&#125;`, `edit-post-&#123;id&#125;`, `delete-post-&#123;id&#125;`</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>F-02</TableCell>
                  <TableCell>Filter and Search Posts</TableCell>
                  <TableCell>On the main page, users must be able to search and filter the post list, which should update in real-time.</TableCell>
                   <TableCell className="font-mono text-xs">`filters-card`, `search-input`, `category-filter`, `priority-filter`</TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell>F-03</TableCell>
                  <TableCell>View a Single Post</TableCell>
                  <TableCell>Clicking on any post card navigates the user to a dedicated detail page (`/posts/[id]`) displaying the full post content and metadata.</TableCell>
                  <TableCell className="font-mono text-xs">`post-details-card-&#123;id&#125;`, `back-to-posts-link`, `post-content`</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>F-04</TableCell>
                  <TableCell>Create a New Post</TableCell>
                  <TableCell>A dedicated page (`/posts/new`) with a comprehensive form for creating a new post.</TableCell>
                  <TableCell className="font-mono text-xs">`post-form-card`, `add-new-post-button`, `title`, `content`, `author`, `imageUrl`, `category`, `priority-low`, `priority-medium`, `priority-high`, `publishDate`, `isPublished`, `submit-post-button`, `cancel-button`</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>F-05</TableCell>
                  <TableCell>Edit an Existing Post</TableCell>
                  <TableCell>An "Edit" button on each post card navigates to an edit page (`/posts/edit/[id]`) that pre-fills the form with existing data.</TableCell>
                  <TableCell className="font-mono text-xs">`edit-post-&#123;id&#125;`, and all IDs from F-04.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>F-06</TableCell>
                  <TableCell>Delete a Post</TableCell>
                  <TableCell>A "Delete" button on each post card triggers a confirmation dialog.</TableCell>
                  <TableCell className="font-mono text-xs">`delete-post-&#123;id&#125;`</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section id="non-functional">
        <h2 className="text-2xl font-semibold mb-4">5. Non-Functional Requirements</h2>
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Req ID</TableHead>
                            <TableHead>Requirement</TableHead>
                            <TableHead>Description</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>NF-01</TableCell>
                            <TableCell>Usability & Accessibility</TableCell>
                            <TableCell>The application must be intuitive and easy to navigate. All interactive elements must have clear labels and unique `id` attributes for testability and accessibility.</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>NF-02</TableCell>
                            <TableCell>Performance</TableCell>
                            <TableCell>The application should be fast and responsive, with minimal loading times between pages.</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>NF-03</TableCell>
                            <TableCell>Responsiveness</TableCell>
                            <TableCell>The user interface must adapt gracefully to various screen sizes, including desktops, tablets, and mobile devices.</TableCell>
                        </TableRow>
                         <TableRow>
                            <TableCell>NF-04</TableCell>
                            <TableCell>Browser Compatibility</TableCell>
                            <TableCell>The application must function correctly on the latest versions of major web browsers (Chrome, Firefox, Safari, Edge).</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </section>
    </div>
  );
}
