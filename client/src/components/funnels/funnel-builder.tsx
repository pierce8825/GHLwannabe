import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import FunnelStep from "./funnel-step";

interface FunnelBuilderProps {
  onBack: () => void;
}

interface Funnel {
  id: number;
  name: string;
  description: string | null;
  status: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

interface FunnelStep {
  id: number;
  funnelId: number;
  title: string;
  type: string;
  order: number;
  content: any;
  settings: any;
  slug: string | null;
  createdAt: string;
  updatedAt: string;
}

const FunnelBuilder = ({ onBack }: FunnelBuilderProps) => {
  const { toast } = useToast();
  
  // State for funnel and description fields
  const [funnelName, setFunnelName] = useState("New Sales Funnel");
  const [funnelDescription, setFunnelDescription] = useState("");
  const [activeTab, setActiveTab] = useState("pages");
  
  // Get funnelId from localStorage (if editing an existing funnel)
  const [funnelId, setFunnelId] = useState<number | null>(() => {
    const storedId = localStorage.getItem('currentEditFunnelId');
    return storedId ? parseInt(storedId, 10) : null;
  });
  
  // Fetch funnel data if we have an ID
  const { data: funnel, isLoading: isFunnelLoading, isError: isFunnelError } = useQuery<Funnel>({
    queryKey: ['/api/funnels', funnelId],
    queryFn: async () => {
      if (!funnelId) {
        return null;
      }
      const response = await fetch(`/api/funnels/${funnelId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch funnel');
      }
      return response.json();
    },
    enabled: !!funnelId
  });
  
  // Fetch funnel steps if we have a funnel ID
  const { data: funnelSteps, isLoading: isStepsLoading, isError: isStepsError } = useQuery<FunnelStep[]>({
    queryKey: ['/api/funnels', funnelId, 'steps'],
    queryFn: async () => {
      if (!funnelId) {
        return [];
      }
      const response = await fetch(`/api/funnels/${funnelId}/steps`);
      if (!response.ok) {
        throw new Error('Failed to fetch funnel steps');
      }
      return response.json();
    },
    enabled: !!funnelId
  });
  
  // Create a new step mutation
  const createStep = useMutation({
    mutationFn: async (newStep: {
      funnelId: number;
      title: string;
      type: string;
      order: number;
      content: any;
      settings: any;
      slug: string | null;
    }) => {
      const response = await fetch(`/api/funnels/${newStep.funnelId}/steps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStep),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create funnel step');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/funnels', funnelId, 'steps'] });
      toast({
        title: "Step created",
        description: "New funnel step has been created",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating step",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Update funnel mutation
  const updateFunnel = useMutation({
    mutationFn: async (updatedFunnel: {
      id: number;
      name: string;
      description: string | null;
      status?: string;
    }) => {
      const response = await fetch(`/api/funnels/${updatedFunnel.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFunnel),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update funnel');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/funnels'] });
      toast({
        title: "Funnel saved",
        description: "Your funnel has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating funnel",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Transform API steps to component format with isActive flag
  const [steps, setSteps] = useState<any[]>([
    {
      id: 1,
      type: "landing",
      title: "Landing Page",
      description: "The main entry point for visitors",
      isActive: true
    }
  ]);
  
  // Create funnel mutation
  const createFunnel = useMutation({
    mutationFn: async (newFunnel: {
      name: string;
      description: string | null;
      status: string;
      userId: number;
    }) => {
      const response = await fetch('/api/funnels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFunnel),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create funnel');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Set the funnel ID so we'll reload with this new funnel
      setFunnelId(data.id);
      localStorage.setItem('currentEditFunnelId', data.id.toString());
      
      // Create a default landing page step for the new funnel
      createStep.mutate({
        funnelId: data.id,
        title: "Landing Page",
        type: "landing",
        order: 0,
        content: {}, // Empty content to start
        settings: {}, // Empty settings to start
        slug: null
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/funnels'] });
      toast({
        title: "Funnel created",
        description: "New funnel has been created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating funnel",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Delete step mutation
  const deleteStep = useMutation({
    mutationFn: async (params: { funnelId: number, stepId: number }) => {
      const response = await fetch(`/api/funnels/${params.funnelId}/steps/${params.stepId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete funnel step');
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/funnels', funnelId, 'steps'] });
      toast({
        title: "Step deleted",
        description: "Funnel step has been deleted",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting step",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Update funnel status mutation
  const updateFunnelStatus = useMutation({
    mutationFn: async (params: { id: number, status: string }) => {
      const response = await fetch(`/api/funnels/${params.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: params.status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update funnel status');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/funnels'] });
      toast({
        title: "Funnel published",
        description: "Your funnel has been published successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error publishing funnel",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Update state when funnel data loads
  useEffect(() => {
    if (funnel) {
      setFunnelName(funnel.name);
      setFunnelDescription(funnel.description || "");
    }
  }, [funnel]);
  
  // Update steps state when API steps load
  useEffect(() => {
    if (funnelSteps && funnelSteps.length > 0) {
      // Convert API steps to component format and set the first one as active
      const formattedSteps = funnelSteps.map((step, index) => ({
        ...step,
        description: step.type, // Use type as description
        isActive: index === 0
      }));
      setSteps(formattedSteps);
    }
  }, [funnelSteps]);

  const handleStepClick = (id: number) => {
    setSteps(steps.map(step => ({
      ...step,
      isActive: step.id === id
    })));
  };

  const handleAddStep = () => {
    if (!funnelId) {
      // If we don't have a funnel ID yet, create the funnel first
      createFunnel.mutate({
        name: funnelName,
        description: funnelDescription || null,
        status: "draft",
        userId: 1 // In a real app, this would be the current user's ID
      });
      // The createFunnel success handler will set funnelId, which will trigger step creation in a useEffect
      return;
    }
    
    // Create a new step in the database
    createStep.mutate({
      funnelId: funnelId,
      title: "New Step",
      type: "custom",
      order: steps.length, // Add to the end
      content: {}, // Empty content to start
      settings: {}, // Empty settings to start
      slug: null
    });
  };

  const handleRemoveStep = (id: number) => {
    // Don't allow removing if only one step remains
    if (steps.length <= 1) {
      toast({
        title: "Cannot remove step",
        description: "A funnel must have at least one step.",
        variant: "destructive"
      });
      return;
    }
    
    // If this is a real database step (not a temporary one)
    if (funnelId && typeof id === 'number') {
      // Delete from database
      deleteStep.mutate({ funnelId, stepId: id });
      
      // Update local state temporarily for better UX
      const newSteps = steps.filter(step => step.id !== id);
      // If the active step was removed, select the first one
      if (steps.find(s => s.id === id)?.isActive) {
        newSteps[0].isActive = true;
      }
      setSteps(newSteps);
    } else {
      // This is a temporary step, just update local state
      const newSteps = steps.filter(step => step.id !== id);
      // If the active step was removed, select the first one
      if (steps.find(s => s.id === id)?.isActive) {
        newSteps[0].isActive = true;
      }
      setSteps(newSteps);
    }
  };

  const activeStep = steps.find(step => step.isActive);

  // Show loading state while fetching funnel data
  if (isFunnelLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button variant="ghost" className="mr-2" disabled>
              <i className="ri-arrow-left-line text-lg"></i>
            </Button>
            <Skeleton className="h-10 w-[300px]" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Funnel Steps</h3>
                <div className="space-y-2">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-[400px] w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (isFunnelError) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="mr-2"
              onClick={onBack}
            >
              <i className="ri-arrow-left-line text-lg"></i>
            </Button>
            <h2 className="text-xl font-semibold">Error Loading Funnel</h2>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <div className="text-red-500 text-5xl mb-4">
                <i className="ri-error-warning-line"></i>
              </div>
              <h3 className="text-xl font-medium mb-2">Failed to load funnel data</h3>
              <p className="text-neutral-500 mb-4">
                There was an error loading the funnel data. Please try again or create a new funnel.
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="outline"
                  onClick={() => {
                    queryClient.invalidateQueries({ queryKey: ['/api/funnels', funnelId] });
                  }}
                >
                  Retry
                </Button>
                <Button onClick={onBack}>
                  Back to Funnels
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2"
            onClick={onBack}
          >
            <i className="ri-arrow-left-line text-lg"></i>
          </Button>
          <Input
            value={funnelName}
            onChange={(e) => setFunnelName(e.target.value)}
            className="text-xl font-semibold px-2 py-1 border-0 focus-visible:ring-0 max-w-[300px]"
          />
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => {
              toast({
                title: "Preview",
                description: "Funnel preview would open in a new tab",
              });
            }}
          >
            <i className="ri-eye-line mr-2"></i> Preview
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              if (!funnelId) {
                // If this is a new funnel, create it
                createFunnel.mutate({
                  name: funnelName,
                  description: funnelDescription || null,
                  status: "draft",
                  userId: 1 // In a real app, this would be the current user's ID
                });
              } else {
                // Update existing funnel
                updateFunnel.mutate({
                  id: funnelId,
                  name: funnelName,
                  description: funnelDescription || null
                });
              }
            }}
            disabled={createFunnel.isPending || updateFunnel.isPending}
          >
            {(createFunnel.isPending || updateFunnel.isPending) ? (
              <>Saving...</>
            ) : (
              <><i className="ri-save-line mr-2"></i> Save</>
            )}
          </Button>
          <Button 
            className="bg-primary text-white hover:bg-primary-dark"
            onClick={() => {
              if (!funnelId) {
                // If this is a new funnel, create it with published status
                createFunnel.mutate({
                  name: funnelName,
                  description: funnelDescription || null,
                  status: "active",
                  userId: 1 // In a real app, this would be the current user's ID
                }, {
                  onSuccess: () => {
                    setTimeout(() => onBack(), 1000); // Go back after a short delay
                  }
                });
              } else {
                // Update existing funnel to published
                updateFunnelStatus.mutate({
                  id: funnelId,
                  status: "active"
                }, {
                  onSuccess: () => {
                    setTimeout(() => onBack(), 1000); // Go back after a short delay
                  }
                });
              }
            }}
            disabled={createFunnel.isPending || updateFunnelStatus.isPending}
          >
            {(createFunnel.isPending || updateFunnelStatus.isPending) ? (
              <>Publishing...</>
            ) : (
              <><i className="ri-rocket-line mr-2"></i> Publish</>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Funnel Steps</h3>
              <div className="space-y-2">
                {isStepsLoading ? (
                  // Show skeleton loading for steps
                  <>
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                  </>
                ) : isStepsError ? (
                  // Show error message for steps
                  <div className="text-center py-4 border border-red-200 rounded-md">
                    <p className="text-red-500 mb-2">Failed to load steps</p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        queryClient.invalidateQueries({ queryKey: ['/api/funnels', funnelId, 'steps'] });
                      }}
                    >
                      Retry
                    </Button>
                  </div>
                ) : (
                  // Display loaded steps
                  steps.map((step, index) => (
                    <div 
                      key={step.id}
                      className={`flex items-center p-3 rounded-md cursor-pointer ${
                        step.isActive ? 'bg-primary text-white' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => handleStepClick(step.id)}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 ${
                        step.isActive ? 'bg-white text-primary' : 'bg-primary text-white'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-medium text-sm truncate">{step.title}</h4>
                        <p className={`text-xs truncate ${
                          step.isActive ? 'text-white/80' : 'text-neutral-500'
                        }`}>
                          {step.type}
                        </p>
                      </div>
                      {steps.length > 1 && (
                        <button 
                          className={`p-1 opacity-60 hover:opacity-100 ${
                            step.isActive ? 'text-white' : 'text-neutral-500'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveStep(step.id);
                          }}
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      )}
                    </div>
                  ))
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full text-sm mt-4"
                  onClick={handleAddStep}
                >
                  <i className="ri-add-line mr-2"></i> Add Step
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="border-b">
                  <TabsList className="px-4">
                    <TabsTrigger value="pages">Page Builder</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="automation">Automation</TabsTrigger>
                    <TabsTrigger value="tracking">Tracking</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="pages" className="p-6">
                  {activeStep && <FunnelStep step={activeStep} />}
                </TabsContent>

                <TabsContent value="settings" className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Funnel Name</label>
                      <Input 
                        value={funnelName}
                        onChange={(e) => setFunnelName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-1">Description</label>
                      <Textarea 
                        placeholder="Enter a description for this funnel..."
                        className="resize-none"
                        value={funnelDescription}
                        onChange={(e) => setFunnelDescription(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-1">Domain/URL Path</label>
                      <div className="flex">
                        <div className="bg-gray-100 border border-r-0 rounded-l-md px-3 py-2 text-sm text-neutral-500">
                          https://yourwebsite.com/
                        </div>
                        <Input 
                          className="rounded-l-none"
                          placeholder="sales-funnel"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="automation" className="p-6">
                  <div className="text-center py-6 border-2 border-dashed rounded-lg">
                    <i className="ri-settings-3-line text-4xl text-neutral-300"></i>
                    <p className="mt-2 text-neutral-500">Set up automations for this funnel</p>
                    <p className="text-sm text-neutral-400 mt-1">
                      Create automated email sequences, notifications, and follow-ups
                    </p>
                    <Button 
                      className="mt-4"
                      onClick={() => {
                        alert("Automation builder would open here.");
                      }}
                    >
                      <i className="ri-add-line mr-2"></i> Add Automation
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="tracking" className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Google Analytics Tracking ID</label>
                      <Input placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-1">Facebook Pixel ID</label>
                      <Input placeholder="XXXXXXXXXXXXXXXXXX" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-1">Custom Tracking Code</label>
                      <Textarea 
                        placeholder="Paste your custom tracking code here..."
                        className="font-mono text-sm h-32"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FunnelBuilder;
