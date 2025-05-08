import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { CSVImporter } from '@/components/ui/csv-importer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ImportDeals() {
  const [_, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const dealFields = [
    { key: 'title', label: 'Deal Title', required: true },
    { key: 'contactId', label: 'Contact ID', required: true },
    { key: 'stage', label: 'Stage', required: true },
    { key: 'amount', label: 'Amount' },
    { key: 'description', label: 'Description' }
  ];

  const handleImportSuccess = () => {
    // Invalidate the deals query to refetch the latest data
    queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setLocation('/pipeline')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Import Deals</h1>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <CSVImporter 
          entityType="deals"
          fields={dealFields}
          onSuccess={handleImportSuccess}
        />
      </div>
    </div>
  );
}