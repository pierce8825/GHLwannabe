import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Define event type for calendar
interface CalendarEvent {
  id: number;
  title: string;
  description: string | null;
  start: string;
  end: string;
  type: string;
  location: string | null;
  userId: number;
  contactId: number | null;
  dealId: number | null;
  allDay: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CalendarPage = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("week");
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Fetch calendar events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['/api/calendar'],
    queryFn: async () => {
      const response = await fetch('/api/calendar');
      if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
      }
      const data = await response.json();
      return data as CalendarEvent[];
    }
  });

  // Process calendar events for UI
  const processedEvents = events.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end)
  }));

  // Form schema for new event
  const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    type: z.string(),
    location: z.string().optional(),
    allDay: z.boolean().default(false),
    date: z.date(),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    contactId: z.string().optional(),
    dealId: z.string().optional()
  });

  // Reset form when selected date changes
  useEffect(() => {
    if (selectedDate) {
      form.setValue('date', selectedDate);
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      
      // Format time as HH:MM
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      form.setValue('startTime', `${formattedHours}:${formattedMinutes}`);
      
      // Set end time to 1 hour later
      const endHour = (hours + 1) % 24;
      const formattedEndHour = endHour.toString().padStart(2, '0');
      form.setValue('endTime', `${formattedEndHour}:${formattedMinutes}`);
    }
  }, [selectedDate]);

  // Form for new event
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "meeting",
      location: "",
      allDay: false,
      date: selectedDate,
      startTime: "09:00",
      endTime: "10:00",
      contactId: "",
      dealId: ""
    }
  });

  // Mutation to create a new calendar event
  const createEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      const response = await apiRequest('/api/calendar', 'POST', eventData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendar'] });
      toast({
        title: "Success!",
        description: "Event has been created.",
      });
      setShowEventDialog(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create the event. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to create event:", error);
    }
  });

  // Mutation to delete a calendar event
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: number) => {
      const response = await apiRequest(`/api/calendar/${eventId}`, 'DELETE');
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendar'] });
      toast({
        title: "Success!",
        description: "Event has been deleted.",
      });
      setSelectedEvent(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete the event. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to delete event:", error);
    }
  });
  
  // Mutation to update an existing calendar event
  const updateEventMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest(`/api/calendar/${id}`, 'PATCH', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendar'] });
      toast({
        title: "Success!",
        description: "Event has been updated.",
      });
      setSelectedEvent(null);
      setShowEventDialog(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update the event. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to update event:", error);
    }
  });
  
  // Function to handle event click for viewing/editing
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    
    // Set form values based on event data
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    
    form.reset({
      title: event.title,
      description: event.description || "",
      type: event.type,
      location: event.location || "",
      allDay: event.allDay,
      date: startDate,
      startTime: `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`,
      endTime: `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`,
      contactId: event.contactId ? event.contactId.toString() : "",
      dealId: event.dealId ? event.dealId.toString() : ""
    });
    
    setShowEventDialog(true);
  };

  // Handle form submission
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Create start and end dates from form data
    let startDate = new Date(data.date);
    let endDate = new Date(data.date);
    
    if (data.allDay) {
      // For all-day events, set to start of day and end of day
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // For timed events, use the form time values
      const [startHours, startMinutes] = data.startTime.split(':').map(Number);
      startDate.setHours(startHours, startMinutes, 0, 0);
      
      const [endHours, endMinutes] = data.endTime.split(':').map(Number);
      endDate.setHours(endHours, endMinutes, 0, 0);
    }

    // Create event data object
    const eventData = {
      title: data.title,
      description: data.description || null,
      type: data.type,
      location: data.location || null,
      allDay: data.allDay,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      contactId: data.contactId ? parseInt(data.contactId) : null,
      dealId: data.dealId ? parseInt(data.dealId) : null,
      userId: 1 // Default to first user for now
    };

    // Check if we're updating an existing event or creating a new one
    if (selectedEvent) {
      updateEventMutation.mutate({ 
        id: selectedEvent.id, 
        data: eventData 
      });
    } else {
      createEventMutation.mutate(eventData);
    }
  };

  // Get week days
  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }

    return days;
  };

  // Check if event is on a specific day
  const isEventOnDay = (event: any, day: Date) => {
    const eventDate = new Date(event.start);
    return (
      eventDate.getDate() === day.getDate() &&
      eventDate.getMonth() === day.getMonth() &&
      eventDate.getFullYear() === day.getFullYear()
    );
  };

  // Get hours for day view
  const getHours = () => {
    const hours = [];
    for (let i = 8; i <= 18; i++) {
      hours.push(i);
    }
    return hours;
  };

  // Format time
  const formatTime = (hours: number) => {
    return `${hours % 12 === 0 ? 12 : hours % 12}${hours < 12 ? 'am' : 'pm'}`;
  };

  // Get events for a specific hour
  const getEventsForHour = (day: Date, hour: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        isEventOnDay(event, day) &&
        eventDate.getHours() === hour
      );
    });
  };

  // Navigate to previous period
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  // Navigate to next period
  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  // Get the title for current view
  const getViewTitle = () => {
    if (view === "month") {
      return format(currentDate, "MMMM yyyy");
    } else if (view === "week") {
      const weekDays = getWeekDays();
      return `${format(weekDays[0], "MMM d")} - ${format(weekDays[6], "MMM d, yyyy")}`;
    } else {
      return format(currentDate, "EEEE, MMMM d, yyyy");
    }
  };

  // Get color for event type
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-primary text-white";
      case "call":
        return "bg-green-500 text-white";
      case "task":
        return "bg-amber-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800">Calendar</h1>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <div className="flex space-x-1">
            <Button variant="outline" size="icon" onClick={goToPrevious}>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNext}>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-lg font-medium ml-2">
            {getViewTitle()}
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <Button 
                variant={view === "month" ? "default" : "outline"} 
                onClick={() => setView("month")}
              >
                Month
              </Button>
              <Button 
                variant={view === "week" ? "default" : "outline"}
                onClick={() => setView("week")}
              >
                Week
              </Button>
              <Button 
                variant={view === "day" ? "default" : "outline"}
                onClick={() => setView("day")}
              >
                Day
              </Button>
            </div>
            <Button 
              className="bg-primary text-white hover:bg-primary-dark"
              onClick={() => {
                setSelectedDate(new Date());
                setShowEventDialog(true);
              }}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>

          {view === "month" && (
            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="text-center p-2 text-sm font-medium">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }).map((_, index) => {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                date.setDate(index - date.getDay() + 1);
                
                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                const isToday = 
                  date.getDate() === new Date().getDate() && 
                  date.getMonth() === new Date().getMonth() && 
                  date.getFullYear() === new Date().getFullYear();
                
                const dayEvents = events.filter(event => isEventOnDay(event, date));
                
                return (
                  <div 
                    key={index} 
                    className={`min-h-24 border p-1 ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'} ${
                      isToday ? 'border-primary' : 'border-gray-200'
                    }`}
                    onClick={() => {
                      setSelectedDate(new Date(date));
                      setShowEventDialog(true);
                    }}
                  >
                    <div className={`text-right text-sm p-1 ${
                      isToday ? 'font-bold text-primary' : isCurrentMonth ? 'text-neutral-800' : 'text-neutral-400'
                    }`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map(event => (
                        <div 
                          key={event.id} 
                          className={`text-xs p-1 rounded truncate cursor-pointer ${getEventTypeColor(event.type)}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event);
                          }}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-neutral-500 p-1">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {view === "week" && (
            <div>
              <div className="grid grid-cols-8 border-b">
                <div className="p-2 text-center text-sm font-medium"></div>
                {getWeekDays().map((day, index) => {
                  const isToday = 
                    day.getDate() === new Date().getDate() && 
                    day.getMonth() === new Date().getMonth() && 
                    day.getFullYear() === new Date().getFullYear();
                  
                  return (
                    <div 
                      key={index} 
                      className={`p-2 text-center ${isToday ? 'bg-blue-50 font-bold' : ''}`}
                    >
                      <div className="text-sm font-medium">{format(day, "EEE")}</div>
                      <div className={`text-lg ${isToday ? 'text-primary' : ''}`}>{format(day, "d")}</div>
                    </div>
                  );
                })}
              </div>
              
              <div className="grid grid-cols-8">
                {getHours().map(hour => (
                  <React.Fragment key={hour}>
                    <div className="border-r border-b p-2 text-xs text-neutral-500">
                      {formatTime(hour)}
                    </div>
                    {getWeekDays().map((day, dayIndex) => {
                      const hourEvents = getEventsForHour(day, hour);
                      
                      return (
                        <div 
                          key={`${hour}-${dayIndex}`} 
                          className="border-r border-b p-1 min-h-16"
                          onClick={() => {
                            const newDate = new Date(day);
                            newDate.setHours(hour, 0, 0, 0);
                            setSelectedDate(newDate);
                            setShowEventDialog(true);
                          }}
                        >
                          {hourEvents.map(event => (
                            <div 
                              key={event.id} 
                              className={`text-xs p-1 mb-1 rounded cursor-pointer ${getEventTypeColor(event.type)}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEventClick(event);
                              }}
                            >
                              {event.title}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {view === "day" && (
            <div>
              <div className="text-center mb-4">
                <div className="text-lg font-medium">{format(currentDate, "EEEE")}</div>
                <div className="text-3xl font-bold">{format(currentDate, "d")}</div>
                <div className="text-sm text-neutral-500">{format(currentDate, "MMMM yyyy")}</div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                {getHours().map(hour => {
                  const hourEvents = getEventsForHour(currentDate, hour);
                  
                  return (
                    <div 
                      key={hour} 
                      className="flex border-b last:border-b-0"
                    >
                      <div className="w-20 p-2 border-r text-sm text-neutral-500 flex-shrink-0">
                        {formatTime(hour)}
                      </div>
                      <div 
                        className="flex-1 min-h-20 p-1"
                        onClick={() => {
                          const newDate = new Date(currentDate);
                          newDate.setHours(hour, 0, 0, 0);
                          setSelectedDate(newDate);
                          setShowEventDialog(true);
                        }}
                      >
                        {hourEvents.map(event => (
                          <div 
                            key={event.id} 
                            className={`p-2 mb-1 rounded cursor-pointer ${getEventTypeColor(event.type)}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                          >
                            <div className="font-medium">{event.title}</div>
                            {event.description && (
                              <div className="text-xs mt-1 opacity-80">{event.description}</div>
                            )}
                            {event.location && (
                              <div className="text-xs mt-1">
                                <MapPinIcon className="inline-block h-3 w-3 mr-1" />
                                {event.location}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog 
        open={showEventDialog} 
        onOpenChange={(open) => {
          if (!open) {
            // Reset form and selected event when dialog is closed
            setSelectedEvent(null);
            form.reset();
          }
          setShowEventDialog(open);
        }}
      >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{selectedEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
            <DialogDescription>
              {selectedEvent 
                ? "Update the details of this calendar event." 
                : "Create a new event or appointment in your calendar."
              }
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title*</FormLabel>
                    <FormControl>
                      <Input placeholder="Meeting with Client" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Event details..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="call">Call</SelectItem>
                          <SelectItem value="task">Task</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="reminder">Reminder</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Where is this event?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allDay"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>All-day event</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {!form.watch("allDay") && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Related Contact</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select contact (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">John Smith (Acme Inc.)</SelectItem>
                          <SelectItem value="2">Sarah Jones (TechStar)</SelectItem>
                          <SelectItem value="3">Michael Davis (Globe Media)</SelectItem>
                          <SelectItem value="4">Jennifer Wilson (Vertex Inc.)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dealId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Related Deal</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select deal (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Website redesign project</SelectItem>
                          <SelectItem value="2">CRM implementation</SelectItem>
                          <SelectItem value="3">Marketing automation</SelectItem>
                          <SelectItem value="4">Sales funnel optimization</SelectItem>
                          <SelectItem value="5">Complete CRM package</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className={cn(
                "flex flex-col-reverse sm:flex-row sm:justify-between",
                selectedEvent ? "justify-between" : "justify-end"
              )}>
                {selectedEvent && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      if (selectedEvent) {
                        deleteEventMutation.mutate(selectedEvent.id);
                        setShowEventDialog(false);
                      }
                    }}
                    disabled={deleteEventMutation.isPending}
                  >
                    {deleteEventMutation.isPending ? "Deleting..." : "Delete Event"}
                  </Button>
                )}
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowEventDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createEventMutation.isPending || updateEventMutation.isPending}
                  >
                    {createEventMutation.isPending || updateEventMutation.isPending
                      ? "Saving..."
                      : selectedEvent ? "Update Event" : "Save Event"
                    }
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;
