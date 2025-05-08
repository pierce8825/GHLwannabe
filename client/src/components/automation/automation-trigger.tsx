import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AutomationTriggerProps {
  step: {
    id: number;
    type: string;
    title: string;
    description: string;
    config: any;
  };
  emailTemplates: Array<{id: string, name: string}>;
  triggerEvents: Array<{id: string, name: string}>;
  onUpdate: (updatedStep: any) => void;
}

const AutomationTrigger = ({ 
  step, 
  emailTemplates, 
  triggerEvents,
  onUpdate 
}: AutomationTriggerProps) => {
  const handleTitleChange = (title: string) => {
    onUpdate({ ...step, title });
  };

  const handleDescriptionChange = (description: string) => {
    onUpdate({ ...step, description });
  };

  const handleConfigChange = (key: string, value: any) => {
    onUpdate({ 
      ...step, 
      config: { ...step.config, [key]: value } 
    });
  };

  const renderTriggerSettings = () => (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">Trigger Event</label>
        <Select 
          defaultValue={step.config.event}
          onValueChange={(value) => handleConfigChange("event", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {triggerEvents.map(event => (
              <SelectItem key={event.id} value={event.id}>{event.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {step.config.event === "tag_added" && (
        <div>
          <label className="text-sm font-medium">Tag</label>
          <Input 
            placeholder="Enter tag name" 
            defaultValue={step.config.tag || ""}
            onChange={(e) => handleConfigChange("tag", e.target.value)}
          />
        </div>
      )}
      
      {step.config.event === "form_submission" && (
        <div>
          <label className="text-sm font-medium">Form</label>
          <Select 
            defaultValue={step.config.formId || "any"}
            onValueChange={(value) => handleConfigChange("formId", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Form</SelectItem>
              <SelectItem value="contact_form">Contact Form</SelectItem>
              <SelectItem value="newsletter">Newsletter Signup</SelectItem>
              <SelectItem value="quote_request">Quote Request</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">Email Template</label>
        <Select 
          defaultValue={step.config.template}
          onValueChange={(value) => handleConfigChange("template", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {emailTemplates.map(template => (
              <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="text-sm font-medium">Subject Line</label>
        <Input 
          placeholder="Email subject" 
          defaultValue={step.config.subject || ""}
          onChange={(e) => handleConfigChange("subject", e.target.value)}
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">From Name</label>
        <Input 
          placeholder="From name" 
          defaultValue={step.config.fromName || ""}
          onChange={(e) => handleConfigChange("fromName", e.target.value)}
        />
      </div>
    </div>
  );

  const renderDelaySettings = () => (
    <div className="space-y-3">
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <label className="text-sm font-medium">Duration</label>
          <Input 
            type="number" 
            min="1"
            defaultValue={step.config.duration || 1}
            onChange={(e) => handleConfigChange("duration", parseInt(e.target.value))}
          />
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium">Unit</label>
          <Select 
            defaultValue={step.config.unit || "days"}
            onValueChange={(value) => handleConfigChange("unit", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minutes">Minutes</SelectItem>
              <SelectItem value="hours">Hours</SelectItem>
              <SelectItem value="days">Days</SelectItem>
              <SelectItem value="weeks">Weeks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderConditionSettings = () => (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">Condition Type</label>
        <Select 
          defaultValue={step.config.condition || "email_opened"}
          onValueChange={(value) => handleConfigChange("condition", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email_opened">Email Opened</SelectItem>
            <SelectItem value="email_clicked">Email Link Clicked</SelectItem>
            <SelectItem value="has_tag">Has Tag</SelectItem>
            <SelectItem value="custom_field">Custom Field Value</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {step.config.condition === "has_tag" && (
        <div>
          <label className="text-sm font-medium">Tag Name</label>
          <Input 
            placeholder="Enter tag name" 
            defaultValue={step.config.tagName || ""}
            onChange={(e) => handleConfigChange("tagName", e.target.value)}
          />
        </div>
      )}
      
      {step.config.condition === "custom_field" && (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Field Name</label>
            <Input 
              placeholder="Enter field name" 
              defaultValue={step.config.fieldName || ""}
              onChange={(e) => handleConfigChange("fieldName", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Operator</label>
            <Select 
              defaultValue={step.config.operator || "equals"}
              onValueChange={(value) => handleConfigChange("operator", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="not_equals">Does Not Equal</SelectItem>
                <SelectItem value="contains">Contains</SelectItem>
                <SelectItem value="greater_than">Greater Than</SelectItem>
                <SelectItem value="less_than">Less Than</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Value</label>
            <Input 
              placeholder="Enter value" 
              defaultValue={step.config.fieldValue || ""}
              onChange={(e) => handleConfigChange("fieldValue", e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderActionSettings = () => (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">Action Type</label>
        <Select 
          defaultValue={step.config.action || "add_tag"}
          onValueChange={(value) => handleConfigChange("action", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="add_tag">Add Tag</SelectItem>
            <SelectItem value="remove_tag">Remove Tag</SelectItem>
            <SelectItem value="update_field">Update Field</SelectItem>
            <SelectItem value="create_task">Create Task</SelectItem>
            <SelectItem value="notify_user">Send Notification</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {(step.config.action === "add_tag" || step.config.action === "remove_tag") && (
        <div>
          <label className="text-sm font-medium">Tag Name</label>
          <Input 
            placeholder="Enter tag name" 
            defaultValue={step.config.value || ""}
            onChange={(e) => handleConfigChange("value", e.target.value)}
          />
        </div>
      )}
      
      {step.config.action === "update_field" && (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Field Name</label>
            <Input 
              placeholder="Enter field name" 
              defaultValue={step.config.fieldName || ""}
              onChange={(e) => handleConfigChange("fieldName", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Field Value</label>
            <Input 
              placeholder="Enter new value" 
              defaultValue={step.config.value || ""}
              onChange={(e) => handleConfigChange("value", e.target.value)}
            />
          </div>
        </div>
      )}
      
      {step.config.action === "create_task" && (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Task Title</label>
            <Input 
              placeholder="Enter task title" 
              defaultValue={step.config.taskTitle || ""}
              onChange={(e) => handleConfigChange("taskTitle", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Due Date</label>
            <Select 
              defaultValue={step.config.dueDate || "1_day"}
              onValueChange={(value) => handleConfigChange("dueDate", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="same_day">Same Day</SelectItem>
                <SelectItem value="1_day">1 Day Later</SelectItem>
                <SelectItem value="2_days">2 Days Later</SelectItem>
                <SelectItem value="1_week">1 Week Later</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Assign To</label>
            <Select 
              defaultValue={step.config.assignTo || "current_user"}
              onValueChange={(value) => handleConfigChange("assignTo", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current_user">Current User</SelectItem>
                <SelectItem value="contact_owner">Contact Owner</SelectItem>
                <SelectItem value="specific_user">Specific User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Step Name</label>
        <Input 
          value={step.title}
          onChange={(e) => handleTitleChange(e.target.value)}
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea 
          value={step.description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          className="resize-none"
        />
      </div>
      
      {/* Render settings based on step type */}
      {step.type === "trigger" && renderTriggerSettings()}
      {step.type === "email" && renderEmailSettings()}
      {step.type === "delay" && renderDelaySettings()}
      {step.type === "condition" && renderConditionSettings()}
      {step.type === "action" && renderActionSettings()}
    </div>
  );
};

export default AutomationTrigger;
