"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { Download, Edit, Trash2, PlusCircle, X } from "lucide-react";
import Image from "next/image";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Label } from "./ui/label";

const elementSchema = z.object({
  elementId: z
    .string()
    .min(1, "ID is required.")
    .regex(/^[a-zA-Z0-9_-]+$/, "ID can only contain letters, numbers, hyphens, and underscores."),
  elementType: z.enum([
    "button",
    "input",
    "textarea",
    "p",
    "h1",
    "h2",
    "h3",
    "a",
    "img",
    "select",
    "checkbox",
  ]),
  value: z.string().optional(),
});

type WebElement = z.infer<typeof elementSchema> & {
  internalId: string;
};

// This is a workaround for the uuid package not working in some environments
const getUuid = () => {
    if (typeof window !== 'undefined' && window.crypto) {
        return window.crypto.randomUUID();
    }
    return uuidv4();
}

export default function WebautoHelper() {
  const [elements, setElements] = useState<WebElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<WebElement | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof elementSchema>>({
    resolver: zodResolver(elementSchema),
    defaultValues: {
      elementId: "",
      elementType: "input",
      value: "",
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        const storedElements = localStorage.getItem("webauto-elements");
        if (storedElements) {
          setElements(JSON.parse(storedElements));
        }
      } catch (error) {
        console.error("Failed to load elements from localStorage", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load saved elements.",
        });
      }
    }
  }, [isClient, toast]);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem("webauto-elements", JSON.stringify(elements));
      } catch (error) {
        console.error("Failed to save elements to localStorage", error);
      }
    }
  }, [elements, isClient]);

  const onSubmit = (values: z.infer<typeof elementSchema>) => {
    if (selectedElement) {
      // Update
      const updatedElements = elements.map((el) =>
        el.internalId === selectedElement.internalId ? { ...el, ...values } : el
      );
      setElements(updatedElements);
      toast({
        title: "Success",
        description: `Element "${values.elementId}" has been updated.`,
      });
    } else {
      // Create
      // Check for duplicate elementId
      if (elements.some(el => el.elementId === values.elementId)) {
        form.setError("elementId", {
          type: "manual",
          message: "This ID is already in use. Please choose a unique ID.",
        });
        return;
      }
      const newElement: WebElement = {
        ...values,
        value: values.value || "",
        internalId: getUuid(),
      };
      setElements([...elements, newElement]);
      toast({
        title: "Success",
        description: `Element "${values.elementId}" has been created.`,
      });
    }
    form.reset();
    setSelectedElement(null);
  };

  const handleEdit = (element: WebElement) => {
    setSelectedElement(element);
    form.reset(element);
  };

  const handleDelete = (internalId: string) => {
    const elementName = elements.find(el => el.internalId === internalId)?.elementId;
    setElements(elements.filter((el) => el.internalId !== internalId));
    toast({
        title: "Element Deleted",
        description: `Element "${elementName}" has been removed.`,
    })
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(elements, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "webauto-elements.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
        title: "Download Started",
        description: "Your JSON file is being downloaded.",
    })
  };

  const cancelEdit = () => {
    setSelectedElement(null);
    form.reset();
  };

  const renderElement = (element: WebElement) => {
    const { internalId, ...rest } = element;
    const commonProps = {
      id: rest.elementId,
      className: "my-2"
    };
    switch (rest.elementType) {
      case "button":
        return <Button key={internalId} {...commonProps}>{rest.value || rest.elementId}</Button>;
      case "input":
        return <Input key={internalId} {...commonProps} defaultValue={rest.value} placeholder={rest.elementId} />;
      case "textarea":
        return <Textarea key={internalId} {...commonProps} defaultValue={rest.value} placeholder={rest.elementId} />;
      case "p":
        return <p key={internalId} {...commonProps} className="p-2 bg-card border rounded-md">{rest.value || `This is a paragraph with id: ${rest.elementId}`}</p>;
      case "h1":
        return <h1 key={internalId} {...commonProps} className="text-4xl font-bold">{rest.value || rest.elementId}</h1>;
      case "h2":
        return <h2 key={internalId} {...commonProps} className="text-3xl font-semibold">{rest.value || rest.elementId}</h2>;
      case "h3":
        return <h3 key={internalId} {...commonProps} className="text-2xl font-semibold">{rest.value || rest.elementId}</h3>;
      case "a":
        return <a key={internalId} {...commonProps} href={rest.value || "#"} className="text-blue-500 underline">{rest.value ? `Link to ${rest.value}` : rest.elementId}</a>;
      case "img":
        return <Image key={internalId} data-ai-hint="image" {...commonProps} src={rest.value || 'https://picsum.photos/seed/1/200/300'} alt={rest.elementId} width={200} height={300} className="rounded-md" />;
      case "select":
        return (
          <Select key={internalId} {...commonProps}>
            <SelectTrigger>
              <SelectValue placeholder={rest.value || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
            </SelectContent>
          </Select>
        );
      case "checkbox":
        return (
          <div key={internalId} className="flex items-center space-x-2 my-2">
            <Checkbox id={rest.elementId} />
            <Label htmlFor={rest.elementId}>{rest.value || rest.elementId}</Label>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-primary tracking-tight">Webauto Helper</h1>
            <p className="text-muted-foreground">Create and manage elements for web automation practice.</p>
        </div>
        <Button id="download-json-button" onClick={handleDownload} disabled={elements.length === 0}>
          <Download className="mr-2" />
          Download JSON
        </Button>
      </div>

      <Tabs defaultValue="manage" className="w-full">
        <TabsList className="grid w-full grid-cols-2" id="main-tabs">
          <TabsTrigger value="manage" id="manage-elements-tab">Manage Elements</TabsTrigger>
          <TabsTrigger value="preview" id="preview-elements-tab">Elements Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="manage">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card id="element-form-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {selectedElement ? <Edit className="mr-2" /> : <PlusCircle className="mr-2" />}
                    {selectedElement ? "Update Element" : "Create Element"}
                  </CardTitle>
                  <CardDescription>
                    {selectedElement ? `Editing element: ${selectedElement.elementId}` : "Add a new element to the page."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="elementId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Element ID</FormLabel>
                            <FormControl>
                              <Input id="element-id-input" placeholder="e.g., login-button" {...field} disabled={!!selectedElement} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="elementType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Element Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger id="element-type-select">
                                  <SelectValue placeholder="Select an element type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="button">Button</SelectItem>
                                <SelectItem value="input">Input</SelectItem>
                                <SelectItem value="textarea">Textarea</SelectItem>
                                <SelectItem value="p">Paragraph</SelectItem>
                                <SelectItem value="h1">Heading 1</SelectItem>
                                <SelectItem value="h2">Heading 2</SelectItem>
                                <SelectItem value="h3">Heading 3</SelectItem>
                                <SelectItem value="a">Link</SelectItem>
                                <SelectItem value="img">Image</SelectItem>
                                <SelectItem value="select">Select</SelectItem>
                                <SelectItem value="checkbox">Checkbox</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Initial Value / Text / URL</FormLabel>
                            <FormControl>
                              <Input id="element-value-input" placeholder="e.g., Click me, or an image URL" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-2 pt-2">
                        <Button id="add-update-button" type="submit" className="flex-grow">
                          {selectedElement ? "Update Element" : "Add Element"}
                        </Button>
                        {selectedElement && (
                          <Button id="cancel-edit-button" variant="outline" type="button" onClick={cancelEdit}>
                            <X className="mr-2" /> Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
                <Card id="elements-list-card">
                    <CardHeader>
                        <CardTitle>Current Elements</CardTitle>
                        <CardDescription>View, edit, or delete your created elements.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         {elements.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                <TableHeader>
                                    <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Value/Text</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {elements.map((el) => (
                                    <TableRow key={el.internalId} id={`element-row-${el.internalId}`}>
                                        <TableCell className="font-medium font-code">{el.elementId}</TableCell>
                                        <TableCell className="capitalize">{el.elementType}</TableCell>
                                        <TableCell className="truncate max-w-xs">{el.value}</TableCell>
                                        <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button id={`edit-button-${el.internalId}`} variant="outline" size="icon" onClick={() => handleEdit(el)}>
                                                <Edit className="h-4 w-4" />
                                                <span className="sr-only">Edit</span>
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button id={`delete-button-${el.internalId}`} variant="destructive" size="icon">
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Delete</span>
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will permanently delete the element <strong className="font-code">{el.elementId}</strong>. This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(el.internalId)}>
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                        </TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div id="no-elements-message" className="text-center text-muted-foreground py-10">
                                <p>No elements created yet.</p>
                                <p>Use the form to add your first element.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>Interact with the elements you've created. View the page source to see their IDs.</CardDescription>
            </CardHeader>
            <CardContent>
              <div id="preview-pane" className="space-y-4 p-4 border-2 border-dashed rounded-lg min-h-[200px] flex flex-col items-start">
                {elements.length > 0 ? (
                  elements.map(renderElement)
                ) : (
                  <div id="no-preview-message" className="w-full text-center text-muted-foreground self-center">
                    <p>No elements to preview.</p>
                    <p>Go to the "Manage Elements" tab to create some.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
