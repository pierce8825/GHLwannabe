import { useQuery, useMutation } from "@tanstack/react-query";
import { Deal } from "@shared/schema";
import DealCard from "./deal-card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const KanbanBoard = () => {
  const { toast } = useToast();
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  const { data: deals, isLoading, error } = useQuery<Deal[]>({
    queryKey: ["/api/deals"],
  });

  const updateDealStageMutation = useMutation({
    mutationFn: async ({ id, stage }: { id: number, stage: string }) => {
      await apiRequest("PUT", `/api/deals/${id}/stage`, { stage });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      toast({
        title: "Deal updated",
        description: "Deal stage has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update deal stage. Please try again.",
        variant: "destructive",
      });
    }
  });

  const stages = ["lead", "qualified", "proposal", "negotiation", "won"];

  // Group deals by stage
  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage] = deals?.filter(deal => deal.stage === stage) || [];
    return acc;
  }, {} as Record<string, Deal[]>);

  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    setDragOverStage(null);
    
    const dealId = e.dataTransfer.getData("dealId");
    if (!dealId) return;
    
    const deal = deals?.find(d => d.id === parseInt(dealId));
    if (!deal || deal.stage === targetStage) return;
    
    updateDealStageMutation.mutate({ id: deal.id, stage: targetStage });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse flex space-x-4 mb-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/6 ml-auto"></div>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {stages.map(stage => (
            <div key={stage} className="animate-pulse bg-gray-100 rounded-lg p-4 min-w-[280px] h-[400px]">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                <div className="h-24 bg-white rounded border border-gray-200"></div>
                <div className="h-24 bg-white rounded border border-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-500 p-8">
          <p>Failed to load deals data</p>
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800">Deal Pipeline</h1>
        <button className="bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded-lg font-medium text-sm flex items-center">
          <i className="ri-add-line mr-2"></i> New Deal
        </button>
      </div>
      
      <div className="flex space-x-4 overflow-x-auto pb-6">
        {stages.map(stage => (
          <div 
            key={stage} 
            className={`kanban-column bg-gray-50 rounded-lg p-3 min-w-[280px] ${dragOverStage === stage ? 'ring-2 ring-primary ring-opacity-50' : ''}`}
            onDragOver={(e) => handleDragOver(e, stage)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage)}
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-neutral-700">{stageLabels[stage]}</h4>
              <span className={`text-xs ${stageBadgeColors[stage]} px-2 py-1 rounded-full`}>
                {dealsByStage[stage]?.length || 0}
              </span>
            </div>
            
            <div className="space-y-3 min-h-[200px]">
              {dealsByStage[stage]?.map(deal => (
                <DealCard key={deal.id} deal={deal} />
              ))}
              
              {dealsByStage[stage]?.length === 0 && (
                <div className="border-2 border-dashed border-gray-200 rounded-lg h-20 flex items-center justify-center text-sm text-neutral-400">
                  Drop deals here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
