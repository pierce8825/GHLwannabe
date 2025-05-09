import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Campaign } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CampaignCard from "@/components/campaigns/campaign-card";
import CampaignForm from "@/components/campaigns/campaign-form";

const Campaigns = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | undefined>(undefined);

  const { data: campaigns, isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const handleAddNew = () => {
    setSelectedCampaign(undefined);
    setShowCampaignForm(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowCampaignForm(true);
  };

  const handleCloseForm = () => {
    setShowCampaignForm(false);
    setSelectedCampaign(undefined);
  };

  // Filter campaigns based on search term and active tab
  const filteredCampaigns = campaigns
    ? campaigns.filter(campaign => {
        const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             campaign.subject?.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (activeTab === "all") return matchesSearch;
        return matchesSearch && campaign.status === activeTab;
      })
    : [];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800">Email Campaigns</h1>
        <div className="mt-4 md:mt-0">
          <Button 
            className="bg-primary text-white hover:bg-primary-dark"
            onClick={handleAddNew}
          >
            <i className="ri-add-line mr-2"></i> Create Campaign
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full md:w-1/2">
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <Input
                placeholder="Search campaigns..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => {
                  alert("Filter options would appear here.");
                }}
              >
                <i className="ri-filter-3-line mr-2"></i> Filter
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  alert("Campaign analytics dashboard would appear here.");
                }}
              >
                <i className="ri-bar-chart-2-line mr-2"></i> Analytics
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Campaigns</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="paused">Paused</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {isLoading ? (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-2 text-neutral-500">Loading campaigns...</p>
                </div>
              ) : filteredCampaigns.length === 0 ? (
                <div className="text-center py-10 border rounded-lg">
                  <i className="ri-mail-line text-4xl text-neutral-300"></i>
                  <p className="mt-2 text-neutral-500">No campaigns found</p>
                  {searchTerm && (
                    <p className="text-sm text-neutral-400">
                      Try adjusting your search or filters
                    </p>
                  )}
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={handleAddNew}
                  >
                    <i className="ri-add-line mr-2"></i> Create Your First Campaign
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCampaigns.map((campaign) => (
                    <CampaignCard 
                      key={campaign.id} 
                      campaign={campaign} 
                      onEdit={() => handleEditCampaign(campaign)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Campaign Form Dialog */}
      <CampaignForm 
        isOpen={showCampaignForm} 
        onClose={handleCloseForm} 
        campaign={selectedCampaign}
      />
    </div>
  );
};

export default Campaigns;
