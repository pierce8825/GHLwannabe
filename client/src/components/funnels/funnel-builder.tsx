import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import FunnelStep from "./funnel-step";

interface FunnelBuilderProps {
  onBack: () => void;
}

const FunnelBuilder = ({ onBack }: FunnelBuilderProps) => {
  const [funnelName, setFunnelName] = useState("New Sales Funnel");
  const [activeTab, setActiveTab] = useState("pages");
  const [steps, setSteps] = useState([
    {
      id: 1,
      type: "landing",
      title: "Landing Page",
      description: "The main entry point for visitors",
      isActive: true
    },
    {
      id: 2,
      type: "form",
      title: "Lead Capture Form",
      description: "Collect information from potential customers",
      isActive: false
    },
    {
      id: 3,
      type: "thank-you",
      title: "Thank You Page",
      description: "Confirmation and next steps",
      isActive: false
    }
  ]);

  const handleStepClick = (id: number) => {
    setSteps(steps.map(step => ({
      ...step,
      isActive: step.id === id
    })));
  };

  const handleAddStep = () => {
    const newId = Math.max(...steps.map(s => s.id)) + 1;
    setSteps([
      ...steps,
      {
        id: newId,
        type: "custom",
        title: "New Step",
        description: "Description for this step",
        isActive: false
      }
    ]);
  };

  const handleRemoveStep = (id: number) => {
    // Don't allow removing if only one step remains
    if (steps.length <= 1) return;
    
    const newSteps = steps.filter(step => step.id !== id);
    // If the active step was removed, select the first one
    if (steps.find(s => s.id === id)?.isActive) {
      newSteps[0].isActive = true;
    }
    setSteps(newSteps);
  };

  const activeStep = steps.find(step => step.isActive);

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
          <Button variant="outline">
            <i className="ri-eye-line mr-2"></i> Preview
          </Button>
          <Button variant="outline">
            <i className="ri-save-line mr-2"></i> Save
          </Button>
          <Button className="bg-primary text-white hover:bg-primary-dark">
            <i className="ri-rocket-line mr-2"></i> Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Funnel Steps</h3>
              <div className="space-y-2">
                {steps.map((step, index) => (
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
                ))}
                
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
                    <Button className="mt-4">
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
