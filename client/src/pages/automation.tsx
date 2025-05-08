import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import WorkflowBuilder from "@/components/automation/workflow-builder";

const Automation = () => {
  const [activeTab, setActiveTab] = useState("workflows");
  const [showBuilder, setShowBuilder] = useState(false);

  // Sample automation templates
  const templates = [
    {
      id: 1,
      name: "Lead Nurturing",
      description: "Nurture new leads with a series of educational emails",
      category: "email",
      steps: 5,
      icon: "ri-mail-line"
    },
    {
      id: 2,
      name: "Welcome Sequence",
      description: "Introduce new customers to your product or service",
      category: "email",
      steps: 3,
      icon: "ri-user-smile-line"
    },
    {
      id: 3,
      name: "Appointment Reminder",
      description: "Send reminders before scheduled appointments",
      category: "notification",
      steps: 2,
      icon: "ri-calendar-event-line"
    },
    {
      id: 4,
      name: "Abandoned Cart Recovery",
      description: "Follow up with customers who abandoned their cart",
      category: "sales",
      steps: 3,
      icon: "ri-shopping-cart-line"
    },
    {
      id: 5,
      name: "Birthday Celebration",
      description: "Send special offers to customers on their birthday",
      category: "engagement",
      steps: 1,
      icon: "ri-gift-line"
    },
    {
      id: 6,
      name: "Customer Feedback",
      description: "Request feedback after customer purchases",
      category: "engagement",
      steps: 2,
      icon: "ri-feedback-line"
    },
  ];

  // Sample active workflows
  const workflows = [
    {
      id: 101,
      name: "New Lead Follow-up",
      description: "Automated email sequence for new leads",
      status: "active",
      stats: {
        contacts: 156,
        completed: 89,
        inProgress: 67
      },
      lastEdited: "2 days ago"
    },
    {
      id: 102,
      name: "Post-Purchase Sequence",
      description: "Thank you and product usage emails",
      status: "active",
      stats: {
        contacts: 243,
        completed: 198,
        inProgress: 45
      },
      lastEdited: "1 week ago"
    },
    {
      id: 103,
      name: "Webinar Registration",
      description: "Confirmation and reminder sequence",
      status: "paused",
      stats: {
        contacts: 78,
        completed: 45,
        inProgress: 33
      },
      lastEdited: "3 days ago"
    }
  ];

  const renderTemplate = (template: any) => (
    <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3`}>
            <i className={`${template.icon} text-xl`}></i>
          </div>
          <div>
            <h3 className="font-semibold text-lg">{template.name}</h3>
            <p className="text-sm text-neutral-500">{template.steps} steps</p>
          </div>
        </div>
        <p className="text-sm text-neutral-600 mb-4">{template.description}</p>
        <Button size="sm" className="w-full" onClick={() => setShowBuilder(true)}>
          Use Template
        </Button>
      </CardContent>
    </Card>
  );

  const renderWorkflow = (workflow: any) => (
    <Card key={workflow.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{workflow.name}</h3>
          <Badge 
            variant="outline" 
            className={workflow.status === 'active' 
              ? 'bg-green-50 text-green-600 border-green-200' 
              : 'bg-amber-50 text-amber-600 border-amber-200'
            }
          >
            {workflow.status}
          </Badge>
        </div>
        <p className="text-sm text-neutral-500 mb-4">{workflow.description}</p>
        
        <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-50 rounded-lg p-3">
          <div className="text-center">
            <p className="text-xs text-neutral-500">Contacts</p>
            <p className="font-semibold">{workflow.stats.contacts}</p>
          </div>
          <div className="text-center border-x border-gray-200">
            <p className="text-xs text-neutral-500">Completed</p>
            <p className="font-semibold text-green-600">{workflow.stats.completed}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-neutral-500">In Progress</p>
            <p className="font-semibold text-amber-600">{workflow.stats.inProgress}</p>
          </div>
        </div>
        
        <div className="flex text-xs text-neutral-500 justify-between mb-4">
          <span>Last edited: {workflow.lastEdited}</span>
          <span>{workflow.status === 'active' ? 'Running' : 'Paused'}</span>
        </div>
        
        <div className="flex space-x-2">
          <Button size="sm" className="flex-1" onClick={() => setShowBuilder(true)}>Edit</Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1" 
          >
            {workflow.status === 'active' ? 'Pause' : 'Resume'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (showBuilder) {
    return <WorkflowBuilder onBack={() => setShowBuilder(false)} />;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800">Automation Workflows</h1>
        <div className="mt-4 md:mt-0">
          <Button 
            className="bg-primary text-white hover:bg-primary-dark"
            onClick={() => setShowBuilder(true)}
          >
            <i className="ri-add-line mr-2"></i> Create Workflow
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="workflows">Active Workflows</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="workflows" className="mt-6">
              {workflows.length === 0 ? (
                <div className="text-center py-10 border rounded-lg">
                  <i className="ri-settings-3-line text-4xl text-neutral-300"></i>
                  <p className="mt-2 text-neutral-500">No active workflows found</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab("templates")}
                  >
                    <i className="ri-add-line mr-2"></i> Create from template
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {workflows.map(renderWorkflow)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="templates" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map(renderTemplate)}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Automation;
