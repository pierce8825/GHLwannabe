import { Campaign } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: () => void;
}

const CampaignCard = ({ campaign, onEdit }: CampaignCardProps) => {
  const { toast } = useToast();

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      await apiRequest("PUT", `/api/campaigns/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: "Campaign updated",
        description: "Campaign status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update campaign status. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleStatusChange = (status: string) => {
    updateStatusMutation.mutate({ id: campaign.id, status });
  };

  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline" className="bg-gray-100 text-gray-600">Draft</Badge>;
      case "active":
        return <Badge variant="outline" className="bg-green-50 text-green-600">Active</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-blue-50 text-primary">Completed</Badge>;
      case "paused":
        return <Badge variant="outline" className="bg-amber-50 text-amber-600">Paused</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="bg-primary h-2"></div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-neutral-800 truncate">{campaign.name}</h3>
              <p className="text-sm text-neutral-500 mt-1">
                {campaign.subject || "No subject"}
              </p>
            </div>
            {getStatusBadge(campaign.status)}
          </div>
          
          <div className="flex items-center text-sm text-neutral-500 mt-2">
            <i className="ri-calendar-line mr-2"></i>
            <span>
              Created: {format(new Date(campaign.createdAt), "MMM d, yyyy")}
            </span>
          </div>
          
          {campaign.scheduledAt && (
            <div className="flex items-center text-sm text-neutral-500 mt-1">
              <i className="ri-time-line mr-2"></i>
              <span>
                Scheduled: {format(new Date(campaign.scheduledAt), "MMM d, yyyy")}
              </span>
            </div>
          )}
          
          <div className="mt-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-neutral-500">
                <i className="ri-mail-line mr-1"></i> 0 sent
              </div>
              <div className="text-sm text-neutral-500">
                <i className="ri-eye-line mr-1"></i> 0 opens
              </div>
              <div className="text-sm text-neutral-500">
                <i className="ri-cursor-line mr-1"></i> 0 clicks
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 bg-gray-50 border-t">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <i className="ri-edit-line mr-1"></i> Edit
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Actions <i className="ri-arrow-down-s-line ml-1"></i>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {campaign.status === "draft" && (
              <DropdownMenuItem onClick={() => handleStatusChange("active")}>
                <i className="ri-play-line mr-2 text-green-600"></i> Activate
              </DropdownMenuItem>
            )}
            {campaign.status === "active" && (
              <DropdownMenuItem onClick={() => handleStatusChange("paused")}>
                <i className="ri-pause-line mr-2 text-amber-600"></i> Pause
              </DropdownMenuItem>
            )}
            {(campaign.status === "paused" || campaign.status === "completed") && (
              <DropdownMenuItem onClick={() => handleStatusChange("active")}>
                <i className="ri-restart-line mr-2 text-green-600"></i> Resume
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onEdit}>
              <i className="ri-edit-line mr-2"></i> Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <i className="ri-file-copy-line mr-2"></i> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <i className="ri-bar-chart-2-line mr-2"></i> Analytics
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default CampaignCard;
