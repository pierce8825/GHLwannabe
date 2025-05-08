import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ConversationListProps {
  conversations: Array<{
    id: number;
    contact: {
      id: number;
      name: string;
      email: string;
      company: string;
    };
    messages: Array<{
      id: number;
      text: string;
      timestamp: string;
      sender: string;
    }>;
    unread: boolean;
    lastActivity: string;
  }>;
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const ConversationList = ({ 
  conversations, 
  selectedId, 
  onSelect 
}: ConversationListProps) => {
  return (
    <div>
      {conversations.map(conversation => {
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        
        return (
          <div 
            key={conversation.id}
            className={`p-3 border-b cursor-pointer transition-colors hover:bg-gray-50 ${
              selectedId === conversation.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => onSelect(conversation.id)}
          >
            <div className="flex">
              <Avatar className="mr-3 h-10 w-10">
                <AvatarFallback>{conversation.contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className={`font-medium truncate ${conversation.unread ? 'font-semibold' : ''}`}>
                    {conversation.contact.name}
                  </h3>
                  <span className="text-xs text-neutral-500 whitespace-nowrap ml-2">
                    {conversation.lastActivity}
                  </span>
                </div>
                
                <p className="text-sm text-neutral-500 truncate">
                  {lastMessage ? (
                    lastMessage.sender === 'me' ? (
                      <span className="text-neutral-400">You: </span>
                    ) : null
                  ) : null}
                  {lastMessage?.text || 'No messages yet'}
                </p>
                
                <div className="flex items-center mt-1">
                  <span className="text-xs text-neutral-500 truncate">
                    {conversation.contact.company}
                  </span>
                  
                  {conversation.unread && (
                    <Badge 
                      variant="default" 
                      className="ml-auto py-0 px-1.5 h-5 bg-primary"
                    >
                      New
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      {conversations.length === 0 && (
        <div className="p-4 text-center text-neutral-500">
          No conversations found
        </div>
      )}
    </div>
  );
};

export default ConversationList;
