import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Contact } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ContactForm from "@/components/contacts/contact-form";
import { format } from "date-fns";

const Contacts = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("all");

  const { data: contacts, isLoading } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/contacts/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({
        title: "Contact deleted",
        description: "Contact has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete contact. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setShowContactForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      deleteContactMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    setSelectedContact(undefined);
    setShowContactForm(true);
  };

  const handleCloseForm = () => {
    setShowContactForm(false);
    setSelectedContact(undefined);
  };

  // Filter and sort contacts
  const filteredContacts = contacts
    ? contacts.filter(contact => {
        const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
        const email = contact.email?.toLowerCase() || "";
        const company = contact.company?.toLowerCase() || "";
        const search = searchTerm.toLowerCase();
        
        const matchesSearch = fullName.includes(search) || 
                            email.includes(search) || 
                            company.includes(search);
        
        if (activeTab === "all") return matchesSearch;
        return matchesSearch && contact.status === activeTab;
      })
    : [];

  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "lead":
        return <Badge variant="outline" className="bg-blue-50 text-primary border-primary">Lead</Badge>;
      case "prospect":
        return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-600">Prospect</Badge>;
      case "customer":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-600">Customer</Badge>;
      case "inactive":
        return <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-600">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800">Contacts & Leads</h1>
        <div className="mt-4 md:mt-0">
          <Button 
            className="bg-primary text-white hover:bg-primary-dark"
            onClick={handleAddNew}
          >
            <i className="ri-add-line mr-2"></i> Add Contact
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full md:w-1/2">
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <Input
                placeholder="Search contacts..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <i className="ri-filter-3-line mr-2"></i> Filter
              </Button>
              <Button variant="outline">
                <i className="ri-upload-2-line mr-2"></i> Import
              </Button>
              <Button variant="outline">
                <i className="ri-download-2-line mr-2"></i> Export
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Contacts</TabsTrigger>
              <TabsTrigger value="lead">Leads</TabsTrigger>
              <TabsTrigger value="prospect">Prospects</TabsTrigger>
              <TabsTrigger value="customer">Customers</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              {isLoading ? (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-2 text-neutral-500">Loading contacts...</p>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="text-center py-10 border rounded-lg">
                  <i className="ri-user-search-line text-4xl text-neutral-300"></i>
                  <p className="mt-2 text-neutral-500">No contacts found</p>
                  {searchTerm && (
                    <p className="text-sm text-neutral-400">
                      Try adjusting your search or filters
                    </p>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell className="font-medium">
                            {contact.firstName} {contact.lastName}
                          </TableCell>
                          <TableCell>{contact.email || "—"}</TableCell>
                          <TableCell>{contact.phone || "—"}</TableCell>
                          <TableCell>{contact.company || "—"}</TableCell>
                          <TableCell>{getStatusBadge(contact.status)}</TableCell>
                          <TableCell>{format(new Date(contact.createdAt), "MMM d, yyyy")}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <i className="ri-more-2-fill"></i>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(contact)}>
                                  <i className="ri-edit-line mr-2"></i> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(contact.id)}>
                                  <i className="ri-delete-bin-line mr-2"></i> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Contact Form Dialog */}
      <ContactForm 
        isOpen={showContactForm} 
        onClose={handleCloseForm} 
        contact={selectedContact}
      />
    </div>
  );
};

export default Contacts;
