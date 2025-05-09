import { useQuery } from "@tanstack/react-query";
import StatsCard from "@/components/dashboard/stats-card";
import PipelineOverview from "@/components/dashboard/pipeline-overview";
import RecentActivity from "@/components/dashboard/recent-activity";
import UpcomingTasks from "@/components/dashboard/upcoming-tasks";
import { useState } from "react";
import ContactForm from "@/components/contacts/contact-form";
import { useLocation } from "wouter";

const Dashboard = () => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [, setLocation] = useLocation();

  interface StatsData {
    totalContacts: number;
    openDeals: number;
    activeCampaigns: number;
    upcomingTasks: number;
  }

  const { data: stats, isLoading } = useQuery<StatsData>({
    queryKey: ["/api/stats"],
  });

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-800">Welcome back, Alex!</h2>
            <p className="text-neutral-500 mt-1">Here's what's happening with your business today.</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button 
              className="bg-white text-primary border border-primary hover:bg-blue-50 px-4 py-2 rounded-lg font-medium text-sm flex items-center"
              onClick={() => {
                setLocation("/import-contacts");
              }}
            >
              <i className="ri-upload-2-line mr-2"></i> Import
            </button>
            <button 
              className="bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded-lg font-medium text-sm flex items-center"
              onClick={() => setShowContactForm(true)}
            >
              <i className="ri-add-line mr-2"></i> Add Contact
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard 
          title="Total Contacts" 
          value={isLoading ? "..." : (stats?.totalContacts !== undefined ? stats.totalContacts : 0)}
          change={{
            value: "8.2% from last month",
            type: "increase"
          }}
          icon="ri-contacts-book-line"
          iconBgColor="bg-blue-100"
          iconColor="text-primary"
        />
        
        <StatsCard 
          title="Open Deals" 
          value={isLoading ? "..." : (stats?.openDeals !== undefined ? stats.openDeals : 0)}
          change={{
            value: "3.1% from last month",
            type: "decrease"
          }}
          icon="ri-exchange-dollar-line"
          iconBgColor="bg-green-100"
          iconColor="text-success"
        />
        
        <StatsCard 
          title="Active Campaigns" 
          value={isLoading ? "..." : (stats?.activeCampaigns !== undefined ? stats.activeCampaigns : 0)}
          change={{
            value: "2 new this week",
            type: "increase"
          }}
          icon="ri-mail-send-line"
          iconBgColor="bg-amber-100"
          iconColor="text-warning"
        />
        
        <StatsCard 
          title="Appointments" 
          value={isLoading ? "..." : (stats?.upcomingTasks !== undefined ? stats.upcomingTasks : 0)}
          change={{
            value: "3 upcoming today",
            type: "neutral"
          }}
          icon="ri-calendar-check-line"
          iconBgColor="bg-purple-100"
          iconColor="text-purple-500"
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PipelineOverview />
        </div>

        <div className="space-y-6">
          <RecentActivity />
          <UpcomingTasks />
        </div>
      </div>

      {/* Contact Form Dialog */}
      <ContactForm 
        isOpen={showContactForm} 
        onClose={() => setShowContactForm(false)} 
      />
    </div>
  );
};

export default Dashboard;
