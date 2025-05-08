import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { CSVImporter } from '@/components/ui/csv-importer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ImportContacts() {
  const [_, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const contactFields = [
    { key: 'firstName', label: 'First Name', required: true },
    { key: 'lastName', label: 'Last Name', required: true },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'company', label: 'Company' },
    { key: 'status', label: 'Status' },
    { key: 'source', label: 'Source' },
    { key: 'notes', label: 'Notes' }
  ];

  const handleImportSuccess = () => {
    // Invalidate the contacts query to refetch the latest data
    queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setLocation('/contacts')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Import Contacts</h1>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <CSVImporter 
          entityType="contacts"
          fields={contactFields}
          onSuccess={handleImportSuccess}
        />
      </div>
    </div>
  );
}