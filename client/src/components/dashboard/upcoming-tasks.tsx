import { useQuery, useMutation } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format, isToday, isTomorrow, addDays } from "date-fns";

const UpcomingTasks = () => {
  const { toast } = useToast();
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const { data: tasks, isLoading, error } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const completeTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PUT", `/api/tasks/${id}/complete`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task completed",
        description: "The task has been marked as completed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      });
    }
  });

  const createTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      const tomorrow = addDays(new Date(), 1);
      await apiRequest("POST", "/api/tasks", {
        title,
        dueDate: tomorrow,
        assignedTo: 1,
        completed: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setNewTaskTitle("");
      setShowAddTask(false);
      toast({
        title: "Task created",
        description: "New task has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleTaskComplete = (id: number) => {
    completeTaskMutation.mutate(id);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      createTaskMutation.mutate(newTaskTitle);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-neutral-800">Upcoming Tasks</h3>
          <div className="animate-pulse w-16 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse p-3 bg-gray-50 rounded-lg flex items-center">
              <div className="w-4 h-4 bg-gray-200 rounded mr-3"></div>
              <div className="flex-1">
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
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
          <p>Failed to load tasks data</p>
        </div>
      </div>
    );
  }

  // Filter to only show upcoming and incomplete tasks
  const upcomingTasks = tasks
    ?.filter(task => !task.completed)
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 4);

  const getDateLabel = (dateStr: Date | null | undefined) => {
    if (!dateStr) return "No date";
    
    const date = new Date(dateStr);
    
    if (isToday(date)) {
      return { text: "Today", className: "bg-red-100 text-danger" };
    }
    
    if (isTomorrow(date)) {
      return { text: "Tomorrow", className: "bg-amber-100 text-amber-600" };
    }
    
    // Get short day name (Mon, Tue, etc)
    return { 
      text: format(date, "E"), 
      className: "bg-gray-200 text-neutral-600" 
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-neutral-800">Upcoming Tasks</h3>
        <button className="text-sm text-primary">View All</button>
      </div>
      
      <div className="space-y-3">
        {upcomingTasks?.map(task => {
          const dateLabel = getDateLabel(task.dueDate);
          
          return (
            <div key={task.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                id={`task-${task.id}`}
                onChange={() => handleTaskComplete(task.id)}
                checked={task.completed}
              />
              <label 
                htmlFor={`task-${task.id}`} 
                className={`ml-3 text-sm font-medium ${task.completed ? 'line-through text-neutral-400' : 'text-neutral-800'}`}
              >
                {task.title}
              </label>
              <span className={`ml-auto text-xs ${dateLabel.className} px-2 py-1 rounded`}>
                {dateLabel.text}
              </span>
            </div>
          );
        })}
        
        {upcomingTasks?.length === 0 && (
          <div className="text-center py-4 text-sm text-neutral-400">
            No upcoming tasks
          </div>
        )}

        {showAddTask ? (
          <form onSubmit={handleCreateTask} className="mt-4">
            <div className="flex items-center">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title..."
                className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={createTaskMutation.isPending}
              />
              <button
                type="submit"
                className="bg-primary text-white p-2 rounded-r-lg hover:bg-primary-dark"
                disabled={createTaskMutation.isPending}
              >
                {createTaskMutation.isPending ? (
                  <i className="ri-loader-4-line animate-spin"></i>
                ) : (
                  <i className="ri-check-line"></i>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowAddTask(false)}
                className="ml-2 p-2 text-neutral-500 hover:text-neutral-700"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
          </form>
        ) : (
          <button 
            className="flex items-center justify-center w-full mt-4 p-2 border border-dashed border-gray-300 rounded-lg text-sm text-neutral-500 hover:text-primary hover:border-primary"
            onClick={() => setShowAddTask(true)}
          >
            <i className="ri-add-line mr-1"></i> Add New Task
          </button>
        )}
      </div>
    </div>
  );
};

export default UpcomingTasks;
