import { Deal } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format, formatDistanceToNow } from "date-fns";

interface DealCardProps {
  deal: Deal;
}

const DealCard = ({ deal }: DealCardProps) => {
  const { toast } = useToast();

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

  const formatTime = (dateStr: Date) => {
    const date = new Date(dateStr);
    const now = new Date();
    
    // If it's today, show "Today"
    if (date.toDateString() === now.toDateString()) {
      return "Today";
    }
    
    // If it's yesterday, show "Yesterday"
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    
    // If it's within the last 7 days, show "X days ago"
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    if (date > sevenDaysAgo) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    
    // Otherwise show the date
    return format(date, "MMM d");
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("dealId", deal.id.toString());
    e.currentTarget.classList.add("shadow-md", "border-primary");
  };

  // Handle drag end
  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("shadow-md", "border-primary");
  };

  return (
    <div 
      className="kanban-card bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-grab"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex justify-between items-start">
        <h5 className="font-medium text-neutral-800">{deal.title}</h5>
        <span className="text-xs bg-blue-50 text-primary px-2 py-1 rounded-full">
          ${deal.amount?.toLocaleString()}
        </span>
      </div>
      <p className="text-sm text-neutral-500 mt-1">{deal.description}</p>
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center">
          <span className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-xs text-neutral-600">
            AJ
          </span>
        </div>
        <span className="text-xs text-neutral-500">{formatTime(deal.updatedAt)}</span>
      </div>
    </div>
  );
};

export default DealCard;
