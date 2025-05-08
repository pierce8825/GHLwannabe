import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: "increase" | "decrease" | "neutral";
  };
  icon: string;
  iconBgColor: string;
  iconColor: string;
}

const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  iconBgColor, 
  iconColor 
}: StatsCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-neutral-500 font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
          {change && (
            <p 
              className={cn(
                "text-sm font-medium flex items-center mt-2",
                change.type === "increase" && "text-success",
                change.type === "decrease" && "text-danger",
                change.type === "neutral" && "text-neutral-500"
              )}
            >
              <i className={cn(
                "mr-1",
                change.type === "increase" && "ri-arrow-up-line",
                change.type === "decrease" && "ri-arrow-down-line",
                change.type === "neutral" && "ri-time-line"
              )}></i>
              {change.value}
            </p>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center text-xl",
          iconBgColor,
          iconColor
        )}>
          <i className={icon}></i>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
