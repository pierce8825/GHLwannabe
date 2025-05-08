import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertCampaignSchema, Campaign } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CampaignFormProps {
  isOpen: boolean;
  onClose: () => void;
  campaign?: Campaign;  // For editing existing campaign
}

const CampaignForm = ({ isOpen, onClose, campaign }: CampaignFormProps) => {
  const { toast } = useToast();
  const isEditing = !!campaign;
  const [activeTab, setActiveTab] = useState("details");

  // Extend schema with validation
  const formSchema = insertCampaignSchema.extend({
    name: z.string().min(1, "Campaign name is required"),
    type: z.string().min(1, "Campaign type is required"),
    subject: z.string().min(1, "Subject line is required for email campaigns"),
    content: z.string().min(1, "Content is required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: campaign?.name || "",
      type: campaign?.type || "email",
      status: campaign?.status || "draft",
      subject: campaign?.subject || "",
      content: campaign?.content || "",
      scheduledAt: campaign?.scheduledAt ? new Date(campaign.scheduledAt) : new Date(Date.now() + 86400000), // tomorrow
    },
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (isEditing && campaign) {
        return apiRequest("PUT", `/api/campaigns/${campaign.id}`, data);
      } else {
        return apiRequest("POST", "/api/campaigns", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: `Campaign ${isEditing ? "updated" : "created"}`,
        description: `Campaign has been ${isEditing ? "updated" : "created"} successfully.`,
      });
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} campaign. Please try again.`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createCampaignMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Campaign" : "Create New Campaign"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update your email campaign settings and content."
              : "Set up your email campaign details, content, and delivery options."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="delivery">Delivery</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Spring Promotion 2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Type*</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select campaign type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="social">Social Media</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="content" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Line*</FormLabel>
                      <FormControl>
                        <Input placeholder="Special Offer Inside!" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Content*</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter your email content here..." 
                          className="min-h-[200px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-4 pt-2">
                  <Button type="button" variant="outline" size="sm">
                    <i className="ri-image-add-line mr-2"></i> Add Images
                  </Button>
                  <Button type="button" variant="outline" size="sm">
                    <i className="ri-link mr-2"></i> Add Links
                  </Button>
                  <Button type="button" variant="outline" size="sm">
                    <i className="ri-user-smile-line mr-2"></i> Personalize
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="delivery" className="space-y-4 mt-4">
                <div className="flex items-center space-x-2 p-4 bg-blue-50 text-blue-800 rounded-md">
                  <i className="ri-information-line text-xl"></i>
                  <p className="text-sm">
                    Scheduling options allow you to set when your campaign should be sent. You can choose to send immediately or schedule for a future date.
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Delivery Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="send-now" 
                        name="delivery-option" 
                        className="mr-2"
                      />
                      <label htmlFor="send-now">Send immediately when activated</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="send-scheduled" 
                        name="delivery-option" 
                        className="mr-2" 
                        defaultChecked
                      />
                      <label htmlFor="send-scheduled">Schedule for later</label>
                    </div>
                    
                    <Input 
                      type="datetime-local" 
                      className="w-full"
                      defaultValue={new Date(Date.now() + 86400000).toISOString().slice(0, 16)}
                    />
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Recipient Options</h3>
                  <div className="space-y-4">
                    <Select defaultValue="all-contacts">
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipients" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-contacts">All Contacts</SelectItem>
                        <SelectItem value="leads">Leads Only</SelectItem>
                        <SelectItem value="customers">Customers Only</SelectItem>
                        <SelectItem value="custom">Custom Segment</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="text-sm text-neutral-500">
                      <i className="ri-user-line mr-1"></i> Estimated recipients: 250
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="pt-4">
              {activeTab !== "details" && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setActiveTab(activeTab === "content" ? "details" : "content")}
                  className="mr-auto"
                >
                  <i className="ri-arrow-left-line mr-2"></i> Back
                </Button>
              )}
              
              {activeTab !== "delivery" && (
                <Button 
                  type="button"
                  onClick={() => setActiveTab(activeTab === "details" ? "content" : "delivery")}
                  className="ml-auto"
                >
                  Next <i className="ri-arrow-right-line ml-2"></i>
                </Button>
              )}
              
              {activeTab === "delivery" && (
                <>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                    disabled={createCampaignMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createCampaignMutation.isPending}
                  >
                    {createCampaignMutation.isPending ? (
                      <div className="flex items-center">
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        {isEditing ? "Updating..." : "Creating..."}
                      </div>
                    ) : (
                      isEditing ? "Update Campaign" : "Create Campaign"
                    )}
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignForm;
