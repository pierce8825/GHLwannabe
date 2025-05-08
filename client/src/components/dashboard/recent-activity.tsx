import { useQuery } from "@tanstack/react-query";
import { Activity } from "@shared/schema";
import { format, formatDistanceToNow } from "date-fns";

const RecentActivity = () => {
  const { data: activities, isLoading, error } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-neutral-800">Recent Activity</h3>
          <div className="animate-pulse w-16 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-gray-200 mr-3 animate-pulse"></div>
              <div className="flex-1">
                <div className="animate-pulse w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="animate-pulse w-1/2 h-3 bg-gray-100 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center text-red-500">
          <p>Failed to load activity data</p>
        </div>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return {
          icon: "ri-mail-line",
          bgColor: "bg-blue-100",
          textColor: "text-primary"
        };
      case "call":
        return {
          icon: "ri-phone-line",
          bgColor: "bg-green-100",
          textColor: "text-success"
        };
      case "meeting":
        return {
          icon: "ri-calendar-check-line",
          bgColor: "bg-amber-100",
          textColor: "text-amber-600"
        };
      case "note":
        return {
          icon: "ri-user-add-line",
          bgColor: "bg-purple-100",
          textColor: "text-purple-600"
        };
      default:
        return {
          icon: "ri-file-list-line",
          bgColor: "bg-gray-100",
          textColor: "text-neutral-600"
        };
    }
  };

  const formatTime = (dateStr: Date) => {
    const date = new Date(dateStr);
    const now = new Date();
    
    // If it's today, show relative time
    if (date.toDateString() === now.toDateString()) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    
    // If it's yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    
    // Otherwise show the date
    return format(date, "MMM d");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-neutral-800">Recent Activity</h3>
        <button className="text-sm text-primary">View All</button>
      </div>
      
      <div className="space-y-4">
        {activities?.slice(0, 4).map(activity => {
          const { icon, bgColor, textColor } = getTypeIcon(activity.type);
          
          return (
            <div key={activity.id} className="flex items-start">
              <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center ${textColor} mr-3 mt-1`}>
                <i className={`${icon} text-sm`}></i>
              </div>
              <div>
                <p className="text-sm text-neutral-800">
                  <span className="font-medium">{activity.title}</span>
                </p>
                <p className="text-xs text-neutral-500">{activity.description}</p>
                <p className="text-xs text-neutral-400 mt-1">{formatTime(activity.createdAt)}</p>
              </div>
            </div>
          );
        })}
        
        {activities?.length === 0 && (
          <div className="text-center py-4 text-sm text-neutral-400">
            No recent activities
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
