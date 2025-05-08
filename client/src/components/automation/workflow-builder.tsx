import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AutomationTrigger from "./automation-trigger";

interface WorkflowBuilderProps {
  onBack: () => void;
}

const WorkflowBuilder = ({ onBack }: WorkflowBuilderProps) => {
  const [workflowName, setWorkflowName] = useState("New Automation Workflow");
  const [activeTab, setActiveTab] = useState("builder");
  const [workflowSteps, setWorkflowSteps] = useState([
    {
      id: 1,
      type: "trigger",
      title: "Trigger",
      description: "When a new lead is created",
      config: { event: "new_lead" }
    },
    {
      id: 2,
      type: "delay",
      title: "Wait",
      description: "Wait for 1 day",
      config: { duration: 1, unit: "days" }
    },
    {
      id: 3,
      type: "email",
      title: "Send Email",
      description: "Welcome email with introduction",
      config: { template: "welcome_email" }
    },
    {
      id: 4,
      type: "condition",
      title: "Check Condition",
      description: "If email was opened",
      config: { condition: "email_opened", value: true }
    },
    {
      id: 5,
      type: "email",
      title: "Send Email",
      description: "Follow-up with more information",
      config: { template: "follow_up_email" }
    }
  ]);

  // Sample email templates
  const emailTemplates = [
    { id: "welcome_email", name: "Welcome Email" },
    { id: "follow_up_email", name: "Follow-up Email" },
    { id: "nurture_1", name: "Nurture Email #1" },
    { id: "nurture_2", name: "Nurture Email #2" },
    { id: "special_offer", name: "Special Offer" }
  ];

  // Sample trigger events
  const triggerEvents = [
    { id: "new_lead", name: "New Lead Created" },
    { id: "form_submission", name: "Form Submitted" },
    { id: "tag_added", name: "Tag Added to Contact" },
    { id: "website_visit", name: "Website Visit" },
    { id: "purchase", name: "Purchase Made" }
  ];

  const handleAddStep = (type: string) => {
    const newId = Math.max(...workflowSteps.map(s => s.id)) + 1;
    const newStep = {
      id: newId,
      type,
      title: getStepTitle(type),
      description: `Description for ${type}`,
      config: getDefaultConfig(type)
    };
    
    setWorkflowSteps([...workflowSteps, newStep]);
  };

  const getStepTitle = (type: string) => {
    switch (type) {
      case "trigger": return "Trigger";
      case "delay": return "Wait";
      case "email": return "Send Email";
      case "condition": return "Check Condition";
      case "action": return "Perform Action";
      default: return "New Step";
    }
  };

  const getDefaultConfig = (type: string) => {
    switch (type) {
      case "trigger": return { event: "new_lead" };
      case "delay": return { duration: 1, unit: "days" };
      case "email": return { template: "welcome_email" };
      case "condition": return { condition: "email_opened", value: true };
      case "action": return { action: "add_tag", value: "interested" };
      default: return {};
    }
  };

  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  
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
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="text-xl font-semibold px-2 py-1 border-0 focus-visible:ring-0 max-w-[300px]"
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <i className="ri-save-line mr-2"></i> Save Draft
          </Button>
          <Button className="bg-primary text-white hover:bg-primary-dark">
            <i className="ri-play-circle-line mr-2"></i> Activate
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b">
              <TabsList className="px-4">
                <TabsTrigger value="builder">Workflow Builder</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="testing">Testing</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="builder" className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <div className="bg-gray-50 border rounded-md p-6 min-h-[600px]">
                    <div className="max-w-2xl mx-auto space-y-4">
                      {workflowSteps.map((step, index) => (
                        <div 
                          key={step.id}
                          className={`bg-white border rounded-md p-4 cursor-pointer transition-colors ${
                            selectedStep === step.id ? 'border-primary' : 'hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedStep(step.id)}
                        >
                          <div className="flex items-start">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white mr-3 ${
                              getStepColor(step.type)
                            }`}>
                              <i className={getStepIcon(step.type)}></i>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{step.title}</h3>
                              <p className="text-sm text-neutral-500">{step.description}</p>
                            </div>
                            {step.type !== "trigger" && (
                              <button 
                                className="text-neutral-400 hover:text-neutral-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setWorkflowSteps(workflowSteps.filter(s => s.id !== step.id));
                                  if (selectedStep === step.id) {
                                    setSelectedStep(null);
                                  }
                                }}
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            )}
                          </div>
                          
                          {index < workflowSteps.length - 1 && (
                            <div className="w-0.5 h-10 bg-gray-200 ml-5 my-1"></div>
                          )}
                        </div>
                      ))}
                      
                      <div className="flex justify-center mt-4 pt-2">
                        <div className="relative">
                          <Button variant="outline" className="mr-2">
                            <i className="ri-add-line mr-2"></i> Add Step
                          </Button>
                          <div className="absolute left-0 top-full mt-1 bg-white border rounded-md shadow-md p-2 z-10 hidden group-hover:block">
                            <div className="space-y-1">
                              <button className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">
                                <i className="ri-mail-line mr-2"></i> Send Email
                              </button>
                              <button className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">
                                <i className="ri-time-line mr-2"></i> Add Delay
                              </button>
                              <button className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">
                                <i className="ri-git-branch-line mr-2"></i> Add Condition
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-4">Add Workflow Steps</h3>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-sm"
                          onClick={() => handleAddStep("email")}
                        >
                          <i className="ri-mail-line mr-2 text-primary"></i> Send Email
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-sm"
                          onClick={() => handleAddStep("delay")}
                        >
                          <i className="ri-time-line mr-2 text-amber-600"></i> Add Delay
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-sm"
                          onClick={() => handleAddStep("condition")}
                        >
                          <i className="ri-git-branch-line mr-2 text-purple-600"></i> Add Condition
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-sm"
                          onClick={() => handleAddStep("action")}
                        >
                          <i className="ri-tools-line mr-2 text-green-600"></i> Perform Action
                        </Button>
                      </div>
                      
                      {selectedStep !== null && (
                        <div className="mt-6 border-t pt-4">
                          <h3 className="font-medium mb-3">Step Settings</h3>
                          <AutomationTrigger
                            step={workflowSteps.find(s => s.id === selectedStep)!}
                            emailTemplates={emailTemplates}
                            triggerEvents={triggerEvents}
                            onUpdate={(updatedStep) => {
                              setWorkflowSteps(workflowSteps.map(s => 
                                s.id === selectedStep ? updatedStep : s
                              ));
                            }}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="p-6">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Workflow Name</label>
                  <Input 
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea placeholder="Describe what this workflow does..." className="resize-none" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select defaultValue="draft">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Audience</label>
                  <Select defaultValue="all_contacts">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_contacts">All Contacts</SelectItem>
                      <SelectItem value="leads">Leads Only</SelectItem>
                      <SelectItem value="customers">Customers Only</SelectItem>
                      <SelectItem value="tagged">Contacts with Specific Tag</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-4 border rounded-md bg-yellow-50">
                  <h4 className="font-medium text-amber-800 flex items-center">
                    <i className="ri-error-warning-line mr-2"></i> Important Settings
                  </h4>
                  <ul className="mt-2 space-y-2 text-sm text-amber-700">
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-line mr-2 mt-0.5"></i>
                      <span>This workflow will only apply to new contacts after it's activated.</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-line mr-2 mt-0.5"></i>
                      <span>Contacts can only go through this workflow once unless re-enrollment is enabled.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex mt-6">
                  <Button variant="outline" className="mr-2">Cancel</Button>
                  <Button>Save Settings</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="testing" className="p-6">
              <div className="max-w-2xl mx-auto text-center py-10 border rounded-lg">
                <i className="ri-test-tube-line text-4xl text-neutral-300"></i>
                <h3 className="mt-2 font-medium text-lg">Test Your Workflow</h3>
                <p className="text-neutral-500 max-w-md mx-auto mt-2">
                  Send a test run of your workflow to verify all steps are working correctly before activating it.
                </p>
                <div className="mt-6 flex justify-center">
                  <Button variant="outline" className="mr-2">
                    <i className="ri-user-line mr-2"></i> Select Test Contact
                  </Button>
                  <Button>
                    <i className="ri-play-circle-line mr-2"></i> Run Test
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="p-6">
              <div className="max-w-2xl mx-auto text-center py-10 border rounded-lg">
                <i className="ri-bar-chart-2-line text-4xl text-neutral-300"></i>
                <h3 className="mt-2 font-medium text-lg">Workflow Analytics</h3>
                <p className="text-neutral-500 max-w-md mx-auto mt-2">
                  Analytics will be available once your workflow is active and has processed contacts.
                </p>
                <Button className="mt-6" disabled>
                  <i className="ri-bar-chart-2-line mr-2"></i> View Analytics
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

function getStepColor(type: string) {
  switch (type) {
    case "trigger": return "bg-blue-500";
    case "email": return "bg-primary";
    case "delay": return "bg-amber-500";
    case "condition": return "bg-purple-500";
    case "action": return "bg-green-500";
    default: return "bg-gray-500";
  }
}

function getStepIcon(type: string) {
  switch (type) {
    case "trigger": return "ri-flashlight-line";
    case "email": return "ri-mail-line";
    case "delay": return "ri-time-line";
    case "condition": return "ri-git-branch-line";
    case "action": return "ri-tools-line";
    default: return "ri-question-line";
  }
}

export default WorkflowBuilder;
