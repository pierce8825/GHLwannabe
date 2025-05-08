import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import ConversationList from "@/components/messaging/conversation-list";
import MessageComposer from "@/components/messaging/message-composer";
import { apiRequest } from "@/lib/queryClient";

const Messaging = () => {
  const [activeTab, setActiveTab] = useState("emails");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const { toast } = useToast();
  
  // SMS form state
  const [smsRecipient, setSmsRecipient] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  const [sendingSms, setSendingSms] = useState(false);
  
  // Email form state
  const [emailRecipient, setEmailRecipient] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  
  // API status
  const [sesStatus, setSesStatus] = useState<"online" | "offline" | "unknown">("unknown");
  const [dialpadStatus, setDialpadStatus] = useState<"online" | "offline" | "unknown">("unknown");
  
  // Sample conversations data
  const conversations = [
    {
      id: 1,
      contact: {
        id: 101,
        name: "John Smith",
        email: "john@acmeinc.com",
        company: "Acme Inc."
      },
      messages: [
        {
          id: 1001,
          text: "Hi John, I'm following up on our conversation about the website redesign project. Do you have time to discuss the details?",
          timestamp: "10:32 AM",
          sender: "me"
        },
        {
          id: 1002,
          text: "Hello Alex, yes I'd be happy to discuss. Are you available for a call tomorrow afternoon?",
          timestamp: "11:45 AM",
          sender: "contact"
        },
        {
          id: 1003,
          text: "That works for me. How about 2 PM?",
          timestamp: "12:03 PM",
          sender: "me"
        },
        {
          id: 1004,
          text: "2 PM is perfect. I'll send you a calendar invite with the meeting details.",
          timestamp: "12:15 PM",
          sender: "contact"
        },
        {
          id: 1005,
          text: "Great! Looking forward to our discussion. I'll prepare some initial concepts to show you.",
          timestamp: "12:20 PM",
          sender: "me"
        }
      ],
      unread: false,
      lastActivity: "Today"
    },
    {
      id: 2,
      contact: {
        id: 102,
        name: "Sarah Jones",
        email: "sarah@techstar.com",
        company: "TechStar Solutions"
      },
      messages: [
        {
          id: 2001,
          text: "Hello Sarah, I wanted to follow up on the CRM implementation we discussed last week.",
          timestamp: "Yesterday",
          sender: "me"
        }
      ],
      unread: true,
      lastActivity: "Yesterday"
    },
    {
      id: 3,
      contact: {
        id: 103,
        name: "Michael Davis",
        email: "michael@globemedia.com",
        company: "Globe Media"
      },
      messages: [
        {
          id: 3001,
          text: "Hi Michael, here are the marketing automation options we talked about.",
          timestamp: "3 days ago",
          sender: "me"
        }
      ],
      unread: false,
      lastActivity: "3 days ago"
    }
  ];

  const selectedConvo = conversations.find(c => c.id === selectedConversation);

  // Handle sending email
  const handleSendEmail = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!emailRecipient || !emailSubject || !emailMessage) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    setSendingEmail(true);
    
    try {
      const response = await apiRequest('/api/messaging/email', {
        method: 'POST',
        body: JSON.stringify({
          to: emailRecipient,
          subject: emailSubject,
          html: emailMessage,
        }),
      });
      
      if (response.success) {
        toast({
          title: "Email sent",
          description: "Your email has been sent successfully",
        });
        
        // Reset form
        setEmailRecipient("");
        setEmailSubject("");
        setEmailMessage("");
        setSesStatus("online");
      } else {
        toast({
          title: "Failed to send email",
          description: response.message || "An error occurred while sending the email",
          variant: "destructive"
        });
        setSesStatus("offline");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      setSesStatus("offline");
    } finally {
      setSendingEmail(false);
    }
  };
  
  // Handle sending SMS
  const handleSendSMS = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!smsRecipient || !smsMessage) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    setSendingSms(true);
    
    try {
      const response = await apiRequest('/api/messaging/sms', {
        method: 'POST',
        body: JSON.stringify({
          to: smsRecipient,
          message: smsMessage,
        }),
      });
      
      if (response.success) {
        toast({
          title: "SMS sent",
          description: "Your SMS has been sent successfully",
        });
        
        // Reset form
        setSmsRecipient("");
        setSmsMessage("");
        setDialpadStatus("online");
      } else {
        toast({
          title: "Failed to send SMS",
          description: response.message || "An error occurred while sending the SMS",
          variant: "destructive"
        });
        setDialpadStatus("offline");
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      setDialpadStatus("offline");
    } finally {
      setSendingSms(false);
    }
  };

  const handleSendMessage = (message: string) => {
    // In a real app, this would send the message to the backend
    console.log(`Sending message to conversation ${selectedConversation}: ${message}`);
  };

  return (
    <div className="p-0 h-full flex flex-col">
      <div className="p-6 pb-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-semibold text-neutral-800">Messaging</h1>
          <div className="mt-4 md:mt-0">
            <Button 
              className="bg-primary text-white hover:bg-primary-dark"
            >
              <i className="ri-add-line mr-2"></i> New Message
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-6 pb-6">
        <Card className="h-full overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="border-b">
              <TabsList className="px-4">
                <TabsTrigger value="emails">
                  <i className="ri-mail-line mr-2"></i> Email
                </TabsTrigger>
                <TabsTrigger value="sms">
                  <i className="ri-message-2-line mr-2"></i> SMS
                </TabsTrigger>
                <TabsTrigger value="templates">
                  <i className="ri-file-text-line mr-2"></i> Templates
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="emails" className="flex-1 overflow-hidden m-0">
              <div className="grid grid-cols-1 md:grid-cols-3 h-full overflow-hidden">
                <div className="col-span-1 border-r overflow-y-auto">
                  <div className="p-4 border-b sticky top-0 bg-white">
                    <div className="relative">
                      <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                      <Input
                        placeholder="Search conversations..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <ConversationList 
                    conversations={conversations} 
                    selectedId={selectedConversation}
                    onSelect={setSelectedConversation}
                  />
                </div>
                
                <div className="col-span-2 flex flex-col h-full overflow-hidden">
                  {selectedConvo ? (
                    <>
                      <div className="p-4 border-b flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="mr-2">
                            <AvatarFallback>{selectedConvo.contact.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{selectedConvo.contact.name}</h3>
                            <p className="text-xs text-neutral-500">{selectedConvo.contact.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <i className="ri-phone-line"></i>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <i className="ri-information-line"></i>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <i className="ri-more-2-line"></i>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {selectedConvo.messages.map(message => (
                          <div 
                            key={message.id} 
                            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[80%] p-3 rounded-lg ${
                                message.sender === 'me' 
                                  ? 'bg-primary text-white rounded-tr-none' 
                                  : 'bg-gray-100 text-neutral-800 rounded-tl-none'
                              }`}
                            >
                              <p>{message.text}</p>
                              <p 
                                className={`text-xs mt-1 text-right ${
                                  message.sender === 'me' ? 'text-white/80' : 'text-neutral-500'
                                }`}
                              >
                                {message.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <MessageComposer onSend={handleSendMessage} />
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                          <i className="ri-mail-line text-2xl text-gray-400"></i>
                        </div>
                        <h3 className="mt-4 font-medium">No conversation selected</h3>
                        <p className="text-neutral-500 text-sm mt-1">Select a conversation from the list</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sms" className="flex-1 overflow-auto m-0 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h3 className="text-lg font-medium mb-4">Send SMS Message</h3>
                  <form onSubmit={handleSendSMS} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Recipient Phone Number</label>
                      <Input 
                        placeholder="+1 (555) 123-4567" 
                        value={smsRecipient}
                        onChange={(e) => setSmsRecipient(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Message</label>
                      <textarea 
                        className="w-full h-32 px-3 py-2 border rounded-md" 
                        placeholder="Type your message here..."
                        value={smsMessage}
                        onChange={(e) => setSmsMessage(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    <Button type="submit" className="w-full" disabled={sendingSms}>
                      {sendingSms ? (
                        <>Sending...</>
                      ) : (
                        <><i className="ri-send-plane-line mr-2"></i> Send SMS</>
                      )}
                    </Button>
                  </form>
                </Card>
                
                <Card className="p-6">
                  <h3 className="text-lg font-medium mb-4">Send Email</h3>
                  <form onSubmit={handleSendEmail} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Recipient Email</label>
                      <Input 
                        placeholder="recipient@example.com" 
                        value={emailRecipient}
                        onChange={(e) => setEmailRecipient(e.target.value)}
                        required
                        type="email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Subject</label>
                      <Input 
                        placeholder="Email subject" 
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Message</label>
                      <textarea 
                        className="w-full h-32 px-3 py-2 border rounded-md" 
                        placeholder="Type your email content here..."
                        value={emailMessage}
                        onChange={(e) => setEmailMessage(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    <Button type="submit" className="w-full" disabled={sendingEmail}>
                      {sendingEmail ? (
                        <>Sending...</>
                      ) : (
                        <><i className="ri-mail-send-line mr-2"></i> Send Email</>
                      )}
                    </Button>
                  </form>
                </Card>

                <Card className="p-6 md:col-span-2">
                  <h3 className="text-lg font-medium mb-4">API Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 border rounded-md">
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      <div>
                        <p className="font-medium">AWS SES</p>
                        <p className="text-sm text-neutral-500">Email delivery service</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-md">
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      <div>
                        <p className="font-medium">Dialpad API</p>
                        <p className="text-sm text-neutral-500">SMS delivery service</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Welcome Email</h3>
                      <Badge variant="outline" className="text-xs">Email</Badge>
                    </div>
                    <p className="text-sm text-neutral-500 mb-4">Initial welcome message for new contacts</p>
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <i className="ri-edit-line mr-1"></i> Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <i className="ri-send-plane-line mr-1"></i> Use
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Follow-up</h3>
                      <Badge variant="outline" className="text-xs">Email</Badge>
                    </div>
                    <p className="text-sm text-neutral-500 mb-4">Standard follow-up message after initial contact</p>
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <i className="ri-edit-line mr-1"></i> Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <i className="ri-send-plane-line mr-1"></i> Use
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Appointment Reminder</h3>
                      <Badge variant="outline" className="text-xs">SMS</Badge>
                    </div>
                    <p className="text-sm text-neutral-500 mb-4">Reminder sent before scheduled appointments</p>
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <i className="ri-edit-line mr-1"></i> Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <i className="ri-send-plane-line mr-1"></i> Use
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-dashed">
                  <CardContent className="p-4 flex flex-col items-center justify-center min-h-[140px]">
                    <i className="ri-add-line text-2xl text-neutral-400"></i>
                    <p className="text-sm text-neutral-500 mt-2">Create New Template</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Messaging;
