import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FunnelBuilder from "@/components/funnels/funnel-builder";

const Funnels = () => {
  const [activeTab, setActiveTab] = useState("templates");

  // Sample funnel templates
  const templates = [
    {
      id: 1,
      name: "Lead Generation",
      description: "Capture and qualify new leads with a landing page and follow-up sequence",
      category: "leads",
      steps: 3,
      icon: "ri-user-add-line"
    },
    {
      id: 2,
      name: "Product Launch",
      description: "Create excitement and drive sales for your new product or service",
      category: "sales",
      steps: 5,
      icon: "ri-rocket-line"
    },
    {
      id: 3,
      name: "Webinar Registration",
      description: "Promote and collect registrations for your upcoming webinar",
      category: "events",
      steps: 4,
      icon: "ri-live-line"
    },
    {
      id: 4,
      name: "Customer Onboarding",
      description: "Guide new customers through your product or service with automated emails",
      category: "customer",
      steps: 4,
      icon: "ri-walk-line"
    },
    {
      id: 5,
      name: "Abandoned Cart Recovery",
      description: "Recover lost sales with targeted follow-up emails",
      category: "sales",
      steps: 3,
      icon: "ri-shopping-cart-line"
    },
    {
      id: 6,
      name: "Feedback Collection",
      description: "Gather valuable insights and testimonials from your customers",
      category: "customer",
      steps: 2,
      icon: "ri-feedback-line"
    },
  ];

  // Sample funnel drafts
  const drafts = [
    {
      id: 101,
      name: "Summer Promo Funnel",
      description: "Special discount campaign for summer products",
      lastEdited: "2 days ago",
      steps: 3,
      status: "draft"
    },
    {
      id: 102,
      name: "Customer Feedback Flow",
      description: "Collect feedback from recent purchases",
      lastEdited: "5 days ago",
      steps: 2,
      status: "draft"
    }
  ];

  // Sample active funnels
  const active = [
    {
      id: 201,
      name: "Free Consultation Funnel",
      description: "Booking flow for free consultations",
      stats: {
        visitors: 245,
        conversions: 37,
        rate: "15.1%"
      },
      lastEdited: "1 week ago",
      steps: 4,
      status: "active"
    }
  ];

  const handleUseTemplate = (template: any) => {
    // Set the template and move to the builder
    setShowBuilder(true);
  };

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
        <Button 
          size="sm" 
          className="w-full"
          onClick={() => handleUseTemplate(template)}
        >
          Use Template
        </Button>
      </CardContent>
    </Card>
  );

  const handleEditDraft = (draft: any) => {
    // Edit the draft funnel
    setShowBuilder(true);
  };

  const handlePreviewDraft = (draft: any) => {
    // Preview the draft funnel (could show a preview modal)
    alert(`Preview of "${draft.name}" funnel would appear here.`);
  };

  const renderDraft = (draft: any) => (
    <Card key={draft.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg">{draft.name}</h3>
        <p className="text-sm text-neutral-500 mb-2">{draft.description}</p>
        <div className="flex justify-between items-center text-xs text-neutral-500 mb-4">
          <span>Last edited: {draft.lastEdited}</span>
          <span>{draft.steps} steps</span>
        </div>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => handleEditDraft(draft)}
          >
            Edit
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => handlePreviewDraft(draft)}
          >
            Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const handleEditActiveFunnel = (funnel: any) => {
    // Edit the active funnel
    setShowBuilder(true);
  };

  const handleViewAnalytics = (funnel: any) => {
    // Show analytics for the funnel
    alert(`Analytics for "${funnel.name}" would appear here. 
Visitors: ${funnel.stats.visitors}
Conversions: ${funnel.stats.conversions}
Rate: ${funnel.stats.rate}`);
  };

  const renderActive = (funnel: any) => (
    <Card key={funnel.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg">{funnel.name}</h3>
        <p className="text-sm text-neutral-500 mb-4">{funnel.description}</p>
        
        <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-50 rounded-lg p-3">
          <div className="text-center">
            <p className="text-xs text-neutral-500">Visitors</p>
            <p className="font-semibold">{funnel.stats.visitors}</p>
          </div>
          <div className="text-center border-x border-gray-200">
            <p className="text-xs text-neutral-500">Conversions</p>
            <p className="font-semibold">{funnel.stats.conversions}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-neutral-500">Rate</p>
            <p className="font-semibold text-green-600">{funnel.stats.rate}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => handleEditActiveFunnel(funnel)}
          >
            Edit
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => handleViewAnalytics(funnel)}
          >
            Analytics
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const [showBuilder, setShowBuilder] = useState(false);

  if (showBuilder) {
    return <FunnelBuilder onBack={() => setShowBuilder(false)} />;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800">Sales Funnels</h1>
        <div className="mt-4 md:mt-0">
          <Button 
            className="bg-primary text-white hover:bg-primary-dark"
            onClick={() => setShowBuilder(true)}
          >
            <i className="ri-add-line mr-2"></i> Create Funnel
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map(renderTemplate)}
              </div>
            </TabsContent>

            <TabsContent value="drafts" className="mt-6">
              {drafts.length === 0 ? (
                <div className="text-center py-10 border rounded-lg">
                  <i className="ri-draft-line text-4xl text-neutral-300"></i>
                  <p className="mt-2 text-neutral-500">No draft funnels found</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setShowBuilder(true)}
                  >
                    <i className="ri-add-line mr-2"></i> Create Your First Funnel
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {drafts.map(renderDraft)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="active" className="mt-6">
              {active.length === 0 ? (
                <div className="text-center py-10 border rounded-lg">
                  <i className="ri-rocket-line text-4xl text-neutral-300"></i>
                  <p className="mt-2 text-neutral-500">No active funnels found</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab("drafts")}
                  >
                    Publish a draft funnel
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {active.map(renderActive)}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Funnels;
