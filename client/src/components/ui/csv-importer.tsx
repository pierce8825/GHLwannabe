import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { parse } from 'papaparse';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, FileSpreadsheet, UploadCloud, CheckCircle2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface CSVImporterProps {
  entityType: 'contacts' | 'deals';
  fields: Array<{
    key: string;
    label: string;
    required?: boolean;
  }>;
  onSuccess?: (data: any) => void;
}

export function CSVImporter({ entityType, fields, onSuccess }: CSVImporterProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'map' | 'preview' | 'complete'>('upload');
  const [previewData, setPreviewData] = useState<any[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFile(file);
    
    parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as any[];
        setCsvData(data);
        
        // Extract headers from the first row
        if (data.length > 0) {
          setHeaders(Object.keys(data[0]));
        }
        
        setCurrentStep('map');
      },
      error: (error) => {
        toast({
          title: 'Error parsing CSV file',
          description: error.message,
          variant: 'destructive',
        });
      }
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    maxFiles: 1
  });

  // Initialize default field mapping when headers change
  useEffect(() => {
    if (headers.length > 0) {
      const initialMapping: Record<string, string> = {};
      
      // Try to find matching headers
      fields.forEach(field => {
        const matchedHeader = headers.find(
          header => header.toLowerCase() === field.key.toLowerCase() || 
                   header.toLowerCase().includes(field.key.toLowerCase())
        );
        
        if (matchedHeader) {
          initialMapping[field.key] = matchedHeader;
        }
      });
      
      setFieldMapping(initialMapping);
    }
  }, [headers, fields]);

  const updateFieldMapping = (fieldKey: string, headerValue: string) => {
    setFieldMapping(prev => ({
      ...prev,
      [fieldKey]: headerValue
    }));
  };

  const generatePreview = () => {
    if (csvData.length === 0) return;
    
    const preview = csvData.slice(0, 5).map(row => {
      const mappedRow: Record<string, any> = {};
      
      Object.entries(fieldMapping).forEach(([fieldKey, headerValue]) => {
        if (headerValue) {
          mappedRow[fieldKey] = row[headerValue];
        }
      });
      
      return mappedRow;
    });
    
    setPreviewData(preview);
    setCurrentStep('preview');
  };

  const processImport = async () => {
    setIsProcessing(true);
    
    try {
      // Map CSV data to the target schema
      const transformedData = csvData.map(row => {
        const transformedRow: Record<string, any> = {};
        
        // Apply the field mapping
        Object.entries(fieldMapping).forEach(([fieldKey, headerValue]) => {
          if (headerValue) {
            transformedRow[fieldKey] = row[headerValue];
          }
        });
        
        return transformedRow;
      });
      
      // Make API call to import data
      const response = await apiRequest('POST', `/api/import/${entityType}`, {
        [entityType]: transformedData
      });
      
      const result = await response.json();
      
      toast({
        title: 'Import Successful',
        description: `Successfully imported ${result.importedContacts?.length || result.importedDeals?.length || 0} ${entityType}`,
      });
      
      setCurrentStep('complete');
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: 'Import Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetImport = () => {
    setFile(null);
    setCsvData([]);
    setHeaders([]);
    setFieldMapping({});
    setPreviewData([]);
    setCurrentStep('upload');
  };

  const renderUploadStep = () => (
    <>
      <CardHeader>
        <CardTitle>Import {entityType.charAt(0).toUpperCase() + entityType.slice(1)}</CardTitle>
        <CardDescription>
          Upload a CSV file to import {entityType} into your CRM
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-border'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2">
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
            <p className="font-medium">
              {isDragActive ? 'Drop the file here' : 'Drag & drop a CSV file here'}
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse
            </p>
          </div>
        </div>
      </CardContent>
    </>
  );

  const renderMapStep = () => (
    <>
      <CardHeader>
        <CardTitle>Map CSV Fields</CardTitle>
        <CardDescription>
          Match your CSV columns to the appropriate fields
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <FileSpreadsheet className="h-4 w-4" />
            <span className="font-medium">{file?.name}</span>
            <span className="text-xs">({csvData.length} rows)</span>
          </div>
          
          <div className="space-y-3">
            {fields.map((field) => (
              <div key={field.key} className="grid grid-cols-2 gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </span>
                </div>
                <Select 
                  value={fieldMapping[field.key] || ''} 
                  onValueChange={(value) => updateFieldMapping(field.key, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a CSV column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">-- Skip this field --</SelectItem>
                    {headers.map((header) => (
                      <SelectItem key={header} value={header}>{header}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={resetImport}>Cancel</Button>
        <Button onClick={generatePreview}>Continue</Button>
      </CardFooter>
    </>
  );

  const renderPreviewStep = () => (
    <>
      <CardHeader>
        <CardTitle>Preview Import</CardTitle>
        <CardDescription>
          Review the first 5 records before importing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <FileSpreadsheet className="h-4 w-4" />
            <span className="font-medium">{file?.name}</span>
            <span className="text-xs">({csvData.length} rows)</span>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  {fields.map((field) => (
                    fieldMapping[field.key] && (
                      <th key={field.key} className="p-2 text-left font-medium">
                        {field.label}
                      </th>
                    )
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, index) => (
                  <tr key={index} className="border-t">
                    {fields.map((field) => (
                      fieldMapping[field.key] && (
                        <td key={field.key} className="p-2 truncate max-w-[200px]">
                          {row[field.key] || '-'}
                        </td>
                      )
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {previewData.length === 0 && (
            <div className="flex items-center gap-2 text-amber-600 p-4 bg-amber-50 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <span>No data to preview. Please check your field mappings.</span>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground italic">
            Showing 5 of {csvData.length} records. {csvData.length > 5 && 'All records will be imported upon confirmation.'}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep('map')}>Back</Button>
        <Button 
          onClick={processImport} 
          disabled={isProcessing || previewData.length === 0}
        >
          {isProcessing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>Import {csvData.length} {entityType}</>
          )}
        </Button>
      </CardFooter>
    </>
  );

  const renderCompleteStep = () => (
    <>
      <CardHeader>
        <CardTitle>Import Complete</CardTitle>
        <CardDescription>
          Your {entityType} have been successfully imported
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center py-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <div>
            <p className="font-medium">Import successful!</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your {entityType} have been added to your CRM.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button onClick={resetImport}>Import More</Button>
      </CardFooter>
    </>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      {currentStep === 'upload' && renderUploadStep()}
      {currentStep === 'map' && renderMapStep()}
      {currentStep === 'preview' && renderPreviewStep()}
      {currentStep === 'complete' && renderCompleteStep()}
    </Card>
  );
}