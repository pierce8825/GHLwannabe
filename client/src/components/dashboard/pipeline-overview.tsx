import { useQuery } from "@tanstack/react-query";
import DealCard from "../pipeline/deal-card";
import { Deal } from "@shared/schema";

const PipelineOverview = () => {
  const { data: deals, isLoading, error } = useQuery<Deal[]>({
    queryKey: ["/api/deals"],
  });

  const stages = ["lead", "qualified", "proposal", "negotiation", "won"];

  // Group deals by stage
  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage] = deals?.filter(deal => deal.stage === stage) || [];
    return acc;
  }, {} as Record<string, Deal[]>);
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-neutral-800">Pipeline Overview</h3>
          <div className="animate-pulse w-16 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-4 min-w-max">
            {stages.map(stage => (
              <div key={stage} className="kanban-column bg-gray-50 rounded-lg p-3 w-72">
                <div className="flex justify-between items-center mb-3">
                  <div className="animate-pulse w-20 h-4 bg-gray-200 rounded"></div>
                  <div className="animate-pulse w-6 h-6 bg-gray-200 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="animate-pulse bg-white p-5 rounded-lg border border-gray-200"></div>
                  <div className="animate-pulse bg-white p-5 rounded-lg border border-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center text-red-500">
          <p>Failed to load pipeline data</p>
        </div>
      </div>
    );
  }

  const stageLabels: Record<string, string> = {
    lead: "Lead",
    qualified: "Qualified",
    proposal: "Proposal",
    negotiation: "Negotiation",
    won: "Won"
  };

  const stageBadgeColors: Record<string, string> = {
    lead: "bg-blue-100 text-primary",
    qualified: "bg-purple-100 text-purple-600",
    proposal: "bg-amber-100 text-amber-600",
    negotiation: "bg-green-100 text-green-600",
    won: "bg-green-100 text-green-600"
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-neutral-800">Pipeline Overview</h3>
        <div className="flex space-x-2">
          <button className="text-neutral-500 hover:text-primary p-1">
            <i className="ri-refresh-line"></i>
          </button>
          <button className="text-neutral-500 hover:text-primary p-1">
            <i className="ri-more-2-fill"></i>
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4 min-w-max">
          {stages.map(stage => (
            <div key={stage} className="kanban-column bg-gray-50 rounded-lg p-3 w-72">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-neutral-700">{stageLabels[stage]}</h4>
                <span className={`text-xs ${stageBadgeColors[stage]} px-2 py-1 rounded-full`}>
                  {dealsByStage[stage]?.length || 0}
                </span>
              </div>
              
              <div className="space-y-3">
                {dealsByStage[stage]?.map(deal => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
                
                {dealsByStage[stage]?.length === 0 && (
                  <div className="text-center py-3 text-sm text-neutral-400">
                    No deals in this stage
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PipelineOverview;
