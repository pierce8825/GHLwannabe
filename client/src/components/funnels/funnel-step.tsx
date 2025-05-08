import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FunnelStepProps {
  step: {
    id: number;
    type: string;
    title: string;
    description: string;
    isActive: boolean;
  };
}

const FunnelStep = ({ step }: FunnelStepProps) => {
  const [stepTitle, setStepTitle] = useState(step.title);
  const [activeDesignTab, setActiveDesignTab] = useState("content");
  const [elements, setElements] = useState([
    { id: 1, type: "header", content: "Welcome to Our Special Offer" },
    { id: 2, type: "text", content: "Sign up below to get exclusive access to our products and services." },
    { id: 3, type: "image", content: "placeholder-image.jpg" },
    { id: 4, type: "form", content: "email-form" },
    { id: 5, type: "button", content: "Get Started Now" }
  ]);

  const elementTemplates = [
    { type: "header", label: "Heading", icon: "ri-heading" },
    { type: "text", label: "Text Block", icon: "ri-text" },
    { type: "image", label: "Image", icon: "ri-image-line" },
    { type: "video", label: "Video", icon: "ri-video-line" },
    { type: "form", label: "Form", icon: "ri-file-list-line" },
    { type: "button", label: "Button", icon: "ri-cursor-line" },
    { type: "divider", label: "Divider", icon: "ri-separator" },
    { type: "testimonial", label: "Testimonial", icon: "ri-double-quotes-l" },
    { type: "countdown", label: "Countdown", icon: "ri-timer-line" },
  ];

  const renderElementEditor = (element: any) => {
    switch (element.type) {
      case "header":
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">Heading Text</label>
            <Input defaultValue={element.content} />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs">Size</label>
                <Select defaultValue="large">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs">Alignment</label>
                <Select defaultValue="center">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case "text":
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">Text Content</label>
            <Textarea defaultValue={element.content} className="min-h-[100px]" />
          </div>
        );
      case "button":
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">Button Text</label>
            <Input defaultValue={element.content} />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs">Style</label>
                <Select defaultValue="primary">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs">Size</label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-xs">Action</label>
              <Select defaultValue="next-step">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="next-step">Go to Next Step</SelectItem>
                  <SelectItem value="url">Go to URL</SelectItem>
                  <SelectItem value="submit">Submit Form</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case "image":
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">Image</label>
            <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center">
              <i className="ri-image-add-line text-3xl text-neutral-300"></i>
              <p className="text-sm text-neutral-500 mt-2">Drag and drop an image or click to upload</p>
              <Button size="sm" variant="outline" className="mt-2">Upload Image</Button>
            </div>
          </div>
        );
      case "form":
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">Form Fields</label>
            <div className="space-y-2">
              <div className="flex items-center border rounded-md p-2">
                <Input disabled value="Email" className="w-1/3 mr-2 bg-gray-50" />
                <Input placeholder="Placeholder text" className="flex-1" />
                <button className="ml-2 text-neutral-400 hover:text-neutral-600">
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
              <div className="flex items-center border rounded-md p-2">
                <Input disabled value="Name" className="w-1/3 mr-2 bg-gray-50" />
                <Input placeholder="Placeholder text" className="flex-1" />
                <button className="ml-2 text-neutral-400 hover:text-neutral-600">
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
              <Button size="sm" variant="outline" className="w-full">
                <i className="ri-add-line mr-2"></i> Add Field
              </Button>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-4 text-neutral-500">
            Select an element to edit its properties
          </div>
        );
    }
  };

  const [selectedElement, setSelectedElement] = useState<number | null>(null);
  const activeElement = selectedElement !== null ? elements.find(e => e.id === selectedElement) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          value={stepTitle}
          onChange={(e) => setStepTitle(e.target.value)}
          className="text-lg font-medium px-0 py-1 border-0 focus-visible:ring-0 max-w-[300px]"
        />
        <div className="flex gap-2">
          <Select defaultValue="desktop">
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desktop">
                <div className="flex items-center">
                  <i className="ri-computer-line mr-2"></i> Desktop
                </div>
              </SelectItem>
              <SelectItem value="tablet">
                <div className="flex items-center">
                  <i className="ri-tablet-line mr-2"></i> Tablet
                </div>
              </SelectItem>
              <SelectItem value="mobile">
                <div className="flex items-center">
                  <i className="ri-smartphone-line mr-2"></i> Mobile
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <i className="ri-eye-line mr-2"></i> Preview
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3 border rounded-md bg-gray-50 min-h-[500px] relative p-4">
          <div className="bg-white shadow-sm rounded-md p-6 max-w-[720px] mx-auto min-h-[400px]">
            {elements.map((element, index) => (
              <div 
                key={element.id}
                className={`mb-4 p-2 rounded border-2 ${selectedElement === element.id ? 'border-primary' : 'border-transparent'} hover:border-gray-200 cursor-pointer`}
                onClick={() => setSelectedElement(element.id)}
              >
                {element.type === 'header' && (
                  <h2 className="text-2xl font-bold text-center">{element.content}</h2>
                )}
                {element.type === 'text' && (
                  <p className="text-center text-neutral-600">{element.content}</p>
                )}
                {element.type === 'image' && (
                  <div className="h-40 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                    <i className="ri-image-line text-4xl"></i>
                  </div>
                )}
                {element.type === 'form' && (
                  <div className="max-w-md mx-auto space-y-2">
                    <div className="space-y-1">
                      <label className="text-sm">Email</label>
                      <Input placeholder="Your email address" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm">Name</label>
                      <Input placeholder="Your name" />
                    </div>
                  </div>
                )}
                {element.type === 'button' && (
                  <div className="text-center mt-4">
                    <Button className="px-8">{element.content}</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1">
          <Tabs value={activeDesignTab} onValueChange={setActiveDesignTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4 mt-4">
              {activeElement ? (
                renderElementEditor(activeElement)
              ) : (
                <div className="space-y-4">
                  <p className="text-sm font-medium">Add Elements</p>
                  <div className="grid grid-cols-3 gap-2">
                    {elementTemplates.map((template, index) => (
                      <button
                        key={index}
                        className="flex flex-col items-center p-2 border rounded hover:bg-gray-50 text-center"
                        onClick={() => {
                          const newId = Math.max(...elements.map(e => e.id)) + 1;
                          const newElement = {
                            id: newId,
                            type: template.type,
                            content: `New ${template.label}`
                          };
                          setElements([...elements, newElement]);
                          setSelectedElement(newId);
                        }}
                      >
                        <i className={`${template.icon} text-xl text-neutral-700`}></i>
                        <span className="text-xs mt-1">{template.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {activeElement && (
                <div className="pt-4 border-t mt-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedElement(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setElements(elements.filter(e => e.id !== activeElement.id));
                      setSelectedElement(null);
                    }}
                  >
                    <i className="ri-delete-bin-line mr-2"></i> Remove
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Step Type</label>
                <Select defaultValue={step.type}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="landing">Landing Page</SelectItem>
                    <SelectItem value="form">Form Page</SelectItem>
                    <SelectItem value="thank-you">Thank You Page</SelectItem>
                    <SelectItem value="upsell">Upsell Page</SelectItem>
                    <SelectItem value="custom">Custom Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Background</label>
                <div className="flex space-x-2 mt-1">
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200 cursor-pointer"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-100 cursor-pointer"></div>
                  <div className="w-8 h-8 rounded-full bg-blue-50 cursor-pointer"></div>
                  <div className="w-8 h-8 rounded-full bg-purple-50 cursor-pointer"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 cursor-pointer"></div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center border border-dashed border-gray-300 text-gray-400 cursor-pointer">
                    <i className="ri-add-line"></i>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Page Title (SEO)</label>
                <Input defaultValue={stepTitle} />
              </div>
              
              <div>
                <label className="text-sm font-medium">Meta Description</label>
                <Textarea className="resize-none" placeholder="Enter description for search engines..." />
              </div>
              
              <div>
                <label className="text-sm font-medium">Custom URL Slug</label>
                <Input placeholder="step-url-slug" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FunnelStep;
