import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageComposerProps {
  onSend: (message: string) => void;
}

const MessageComposer = ({ onSend }: MessageComposerProps) => {
  const [message, setMessage] = useState("");
  
  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="p-3 border-t bg-white">
      <div className="flex items-start">
        <Textarea
          placeholder="Type your message..."
          className="resize-none min-h-[80px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="ml-2 flex flex-col space-y-2">
          <Button 
            type="button"
            onClick={handleSend}
            disabled={!message.trim()}
            className="bg-primary text-white"
          >
            <i className="ri-send-plane-fill"></i>
          </Button>
          <Button type="button" variant="outline" size="icon">
            <i className="ri-attachment-2"></i>
          </Button>
          <Button type="button" variant="outline" size="icon">
            <i className="ri-emotion-line"></i>
          </Button>
        </div>
      </div>
      <div className="flex justify-between text-xs text-neutral-500 mt-2">
        <div className="flex items-center space-x-3">
          <button className="hover:text-neutral-700">
            <i className="ri-file-text-line mr-1"></i> Templates
          </button>
          <button className="hover:text-neutral-700">
            <i className="ri-image-line mr-1"></i> Images
          </button>
          <button className="hover:text-neutral-700">
            <i className="ri-calendar-line mr-1"></i> Schedule
          </button>
        </div>
        <div>
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;
