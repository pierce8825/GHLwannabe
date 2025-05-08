import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(false);
  
  // Sample user data
  const user = {
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "Administrator",
    company: "Your Company Name",
    plan: "Professional",
    avatarUrl: ""
  };

  const handleSaveChanges = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Settings saved",
        description: "Your changes have been saved successfully.",
      });
    }, 1000);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <div className="space-y-1">
              <div className="flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                  <i className="ri-user-3-line"></i>
                </div>
                <span>Alex Johnson</span>
              </div>
              <Separator className="my-2" />
            </div>
            <nav className="space-y-1 mt-4">
              <button 
                className={`flex items-center p-2 w-full text-left rounded-md ${activeTab === "account" ? "bg-blue-50 text-primary" : "hover:bg-gray-100"}`}
                onClick={() => setActiveTab("account")}
              >
                <i className={`ri-user-settings-line mr-3 ${activeTab === "account" ? "text-primary" : ""}`}></i>
                Account
              </button>
              <button 
                className={`flex items-center p-2 w-full text-left rounded-md ${activeTab === "profile" ? "bg-blue-50 text-primary" : "hover:bg-gray-100"}`}
                onClick={() => setActiveTab("profile")}
              >
                <i className={`ri-profile-line mr-3 ${activeTab === "profile" ? "text-primary" : ""}`}></i>
                Profile
              </button>
              <button 
                className={`flex items-center p-2 w-full text-left rounded-md ${activeTab === "team" ? "bg-blue-50 text-primary" : "hover:bg-gray-100"}`}
                onClick={() => setActiveTab("team")}
              >
                <i className={`ri-team-line mr-3 ${activeTab === "team" ? "text-primary" : ""}`}></i>
                Team
              </button>
              <button 
                className={`flex items-center p-2 w-full text-left rounded-md ${activeTab === "billing" ? "bg-blue-50 text-primary" : "hover:bg-gray-100"}`}
                onClick={() => setActiveTab("billing")}
              >
                <i className={`ri-bank-card-line mr-3 ${activeTab === "billing" ? "text-primary" : ""}`}></i>
                Billing
              </button>
              <button 
                className={`flex items-center p-2 w-full text-left rounded-md ${activeTab === "integrations" ? "bg-blue-50 text-primary" : "hover:bg-gray-100"}`}
                onClick={() => setActiveTab("integrations")}
              >
                <i className={`ri-plug-line mr-3 ${activeTab === "integrations" ? "text-primary" : ""}`}></i>
                Integrations
              </button>
              <button 
                className={`flex items-center p-2 w-full text-left rounded-md ${activeTab === "appearance" ? "bg-blue-50 text-primary" : "hover:bg-gray-100"}`}
                onClick={() => setActiveTab("appearance")}
              >
                <i className={`ri-paint-brush-line mr-3 ${activeTab === "appearance" ? "text-primary" : ""}`}></i>
                Appearance
              </button>
              <button 
                className={`flex items-center p-2 w-full text-left rounded-md ${activeTab === "security" ? "bg-blue-50 text-primary" : "hover:bg-gray-100"}`}
                onClick={() => setActiveTab("security")}
              >
                <i className={`ri-shield-line mr-3 ${activeTab === "security" ? "text-primary" : ""}`}></i>
                Security
              </button>
            </nav>
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          {activeTab === "account" && (
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <Avatar className="w-24 h-24">
                      <AvatarFallback className="text-2xl">AJ</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">{user.name}</h3>
                      <p className="text-sm text-neutral-500">{user.email}</p>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <i className="ri-upload-2-line mr-2"></i> Upload Photo
                        </Button>
                        <Button variant="outline" size="sm">
                          <i className="ri-delete-bin-line mr-2"></i> Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={user.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" defaultValue={user.company} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select defaultValue={user.role.toLowerCase()}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="administrator">Administrator</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="user">Regular User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Preferences</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications" className="text-base">Email Notifications</Label>
                      <p className="text-sm text-neutral-500">Receive notifications about activity, reminders, and updates</p>
                    </div>
                    <Switch id="emailNotifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="mobileNotifications" className="text-base">Mobile Notifications</Label>
                      <p className="text-sm text-neutral-500">Get push notifications on your mobile device</p>
                    </div>
                    <Switch id="mobileNotifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weeklyDigest" className="text-base">Weekly Digest</Label>
                      <p className="text-sm text-neutral-500">Receive a weekly summary of activities and performance</p>
                    </div>
                    <Switch id="weeklyDigest" />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleSaveChanges} disabled={loading}>
                    {loading ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your professional profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea 
                    id="bio" 
                    className="w-full min-h-32 p-2 border rounded-md"
                    placeholder="Tell us about yourself"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Job Title</Label>
                    <Input id="position" placeholder="e.g. Marketing Manager" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" placeholder="e.g. Marketing" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="e.g. New York, NY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="america_new_york">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america_new_york">Eastern Time (ET)</SelectItem>
                        <SelectItem value="america_chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="america_denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="america_los_angeles">Pacific Time (PT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Social Profiles</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <div className="flex">
                        <div className="bg-gray-100 border border-r-0 rounded-l-md px-3 py-2 text-sm text-neutral-500">
                          linkedin.com/in/
                        </div>
                        <Input id="linkedin" className="rounded-l-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter</Label>
                      <div className="flex">
                        <div className="bg-gray-100 border border-r-0 rounded-l-md px-3 py-2 text-sm text-neutral-500">
                          twitter.com/
                        </div>
                        <Input id="twitter" className="rounded-l-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleSaveChanges} disabled={loading}>
                    {loading ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Saving...
                      </>
                    ) : (
                      'Save Profile'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "team" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage your team and user permissions
                  </CardDescription>
                </div>
                <Button className="bg-primary text-white hover:bg-primary-dark">
                  <i className="ri-user-add-line mr-2"></i> Add User
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 p-4 font-medium border-b bg-gray-50">
                      <div className="col-span-2">User</div>
                      <div>Role</div>
                      <div>Status</div>
                      <div className="text-right">Actions</div>
                    </div>
                    <div className="divide-y">
                      <div className="grid grid-cols-5 p-4 items-center">
                        <div className="col-span-2 flex items-center">
                          <Avatar className="mr-2">
                            <AvatarFallback>AJ</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Alex Johnson</div>
                            <div className="text-sm text-neutral-500">alex@example.com</div>
                          </div>
                        </div>
                        <div>
                          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                            Administrator
                          </Badge>
                        </div>
                        <div>
                          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                            Active
                          </Badge>
                        </div>
                        <div className="text-right">
                          <Button variant="ghost" size="sm">
                            <i className="ri-more-2-fill"></i>
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 p-4 items-center">
                        <div className="col-span-2 flex items-center">
                          <Avatar className="mr-2">
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Jane Doe</div>
                            <div className="text-sm text-neutral-500">jane@example.com</div>
                          </div>
                        </div>
                        <div>
                          <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
                            Manager
                          </Badge>
                        </div>
                        <div>
                          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                            Active
                          </Badge>
                        </div>
                        <div className="text-right">
                          <Button variant="ghost" size="sm">
                            <i className="ri-more-2-fill"></i>
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 p-4 items-center">
                        <div className="col-span-2 flex items-center">
                          <Avatar className="mr-2">
                            <AvatarFallback>BS</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Bob Smith</div>
                            <div className="text-sm text-neutral-500">bob@example.com</div>
                          </div>
                        </div>
                        <div>
                          <Badge variant="outline" className="bg-gray-100 border-gray-200 text-gray-700">
                            User
                          </Badge>
                        </div>
                        <div>
                          <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">
                            Invited
                          </Badge>
                        </div>
                        <div className="text-right">
                          <Button variant="ghost" size="sm">
                            <i className="ri-more-2-fill"></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <h3 className="text-lg font-medium mb-4">Role Permissions</h3>
                    
                    <div className="rounded-md border">
                      <div className="bg-gray-50 p-4 border-b">
                        <div className="grid grid-cols-5 font-medium">
                          <div className="col-span-2">Permission</div>
                          <div>Administrator</div>
                          <div>Manager</div>
                          <div>User</div>
                        </div>
                      </div>
                      <div className="divide-y">
                        <div className="p-4">
                          <div className="grid grid-cols-5 items-center">
                            <div className="col-span-2">
                              <div className="font-medium">View Contacts</div>
                              <div className="text-sm text-neutral-500">Access to view contact details</div>
                            </div>
                            <div><Switch defaultChecked disabled /></div>
                            <div><Switch defaultChecked disabled /></div>
                            <div><Switch defaultChecked disabled /></div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-5 items-center">
                            <div className="col-span-2">
                              <div className="font-medium">Manage Deals</div>
                              <div className="text-sm text-neutral-500">Create and update deals</div>
                            </div>
                            <div><Switch defaultChecked disabled /></div>
                            <div><Switch defaultChecked disabled /></div>
                            <div><Switch defaultChecked={false} disabled /></div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-5 items-center">
                            <div className="col-span-2">
                              <div className="font-medium">Admin Settings</div>
                              <div className="text-sm text-neutral-500">Access to all settings</div>
                            </div>
                            <div><Switch defaultChecked disabled /></div>
                            <div><Switch defaultChecked={false} disabled /></div>
                            <div><Switch defaultChecked={false} disabled /></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "billing" && (
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>
                  Manage your subscription plan and payment details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-blue-700">
                        {user.plan} Plan
                      </h3>
                      <p className="text-sm text-blue-600 mt-1">
                        Your plan renews on July 28, 2023
                      </p>
                    </div>
                    <Button>Upgrade Plan</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Plan Details</h3>
                  
                  <div className="grid grid-cols-3 gap-4 border rounded-lg p-4">
                    <div>
                      <div className="text-sm text-neutral-500">Contacts</div>
                      <div className="text-xl font-medium mt-1">
                        1,243 <span className="text-sm text-neutral-500">/ 10,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "12%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-neutral-500">Team Members</div>
                      <div className="text-xl font-medium mt-1">
                        3 <span className="text-sm text-neutral-500">/ 10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-neutral-500">Automations</div>
                      <div className="text-xl font-medium mt-1">
                        5 <span className="text-sm text-neutral-500">/ 20</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: "25%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Payment Method</h3>
                    <Button variant="outline">
                      <i className="ri-add-line mr-2"></i> Add Method
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center mr-4">
                        <i className="ri-visa-line text-blue-600 text-xl"></i>
                      </div>
                      <div>
                        <div className="font-medium">Visa ending in 4242</div>
                        <div className="text-sm text-neutral-500">Expires 04/2025</div>
                      </div>
                      <div className="ml-auto flex space-x-2">
                        <Badge variant="outline" className="ml-auto bg-green-50 border-green-200 text-green-700">
                          Default
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <i className="ri-edit-line"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Billing History</h3>
                  
                  <div className="rounded-md border">
                    <div className="bg-gray-50 p-3 border-b grid grid-cols-5 font-medium">
                      <div className="col-span-2">Date</div>
                      <div>Amount</div>
                      <div>Status</div>
                      <div className="text-right">Invoice</div>
                    </div>
                    <div className="divide-y">
                      <div className="p-3 grid grid-cols-5 items-center">
                        <div className="col-span-2">
                          <div>June 28, 2023</div>
                          <div className="text-sm text-neutral-500">Professional Plan - Monthly</div>
                        </div>
                        <div>$49.00</div>
                        <div>
                          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                            Paid
                          </Badge>
                        </div>
                        <div className="text-right">
                          <Button variant="ghost" size="sm">
                            <i className="ri-download-line"></i>
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 grid grid-cols-5 items-center">
                        <div className="col-span-2">
                          <div>May 28, 2023</div>
                          <div className="text-sm text-neutral-500">Professional Plan - Monthly</div>
                        </div>
                        <div>$49.00</div>
                        <div>
                          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                            Paid
                          </Badge>
                        </div>
                        <div className="text-right">
                          <Button variant="ghost" size="sm">
                            <i className="ri-download-line"></i>
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 grid grid-cols-5 items-center">
                        <div className="col-span-2">
                          <div>April 28, 2023</div>
                          <div className="text-sm text-neutral-500">Professional Plan - Monthly</div>
                        </div>
                        <div>$49.00</div>
                        <div>
                          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                            Paid
                          </Badge>
                        </div>
                        <div className="text-right">
                          <Button variant="ghost" size="sm">
                            <i className="ri-download-line"></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "integrations" && (
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>
                  Connect your CRM with other tools and services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center mr-4">
                            <i className="ri-google-line text-blue-600 text-2xl"></i>
                          </div>
                          <div>
                            <h3 className="font-medium">Google</h3>
                            <p className="text-sm text-neutral-500">Google Calendar, Gmail, Drive</p>
                          </div>
                        </div>
                        <Switch id="google" defaultChecked />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center mr-4">
                            <i className="ri-microsoft-line text-blue-600 text-2xl"></i>
                          </div>
                          <div>
                            <h3 className="font-medium">Microsoft</h3>
                            <p className="text-sm text-neutral-500">Outlook, Calendar, OneDrive</p>
                          </div>
                        </div>
                        <Switch id="microsoft" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-purple-100 rounded-md flex items-center justify-center mr-4">
                            <i className="ri-slack-line text-purple-600 text-2xl"></i>
                          </div>
                          <div>
                            <h3 className="font-medium">Slack</h3>
                            <p className="text-sm text-neutral-500">Messaging and notifications</p>
                          </div>
                        </div>
                        <Switch id="slack" defaultChecked />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-green-100 rounded-md flex items-center justify-center mr-4">
                            <i className="ri-stripe-line text-green-600 text-2xl"></i>
                          </div>
                          <div>
                            <h3 className="font-medium">Stripe</h3>
                            <p className="text-sm text-neutral-500">Payment processing</p>
                          </div>
                        </div>
                        <Switch id="stripe" defaultChecked />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-yellow-100 rounded-md flex items-center justify-center mr-4">
                            <i className="ri-mail-line text-yellow-600 text-2xl"></i>
                          </div>
                          <div>
                            <h3 className="font-medium">Mailchimp</h3>
                            <p className="text-sm text-neutral-500">Email marketing</p>
                          </div>
                        </div>
                        <Switch id="mailchimp" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center mr-4">
                            <i className="ri-facebook-box-line text-blue-600 text-2xl"></i>
                          </div>
                          <div>
                            <h3 className="font-medium">Facebook</h3>
                            <p className="text-sm text-neutral-500">Ads and Lead Forms</p>
                          </div>
                        </div>
                        <Switch id="facebook" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">API Access</h3>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">API Key</h4>
                        <p className="text-sm text-neutral-500">Use this key to access the API</p>
                      </div>
                      <Button variant="outline">
                        <i className="ri-key-2-line mr-2"></i> Generate Key
                      </Button>
                    </div>
                    
                    <div className="mt-4">
                      <Input 
                        value="•••••••••••••••••••••••••••••••" 
                        className="font-mono" 
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Webhooks</h4>
                        <p className="text-sm text-neutral-500">Set up webhooks to receive events</p>
                      </div>
                      <Button variant="outline">
                        <i className="ri-add-line mr-2"></i> Add Webhook
                      </Button>
                    </div>
                    
                    <div className="mt-4 text-center text-sm text-neutral-500 py-4">
                      No webhooks configured yet.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the look and feel of your CRM
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Theme</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="overflow-hidden border-2 border-primary">
                      <div className="h-24 bg-white"></div>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Light</div>
                          <Badge variant="outline" className="bg-primary-foreground text-primary">
                            Active
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="overflow-hidden">
                      <div className="h-24 bg-neutral-900"></div>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Dark</div>
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            Apply
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="overflow-hidden">
                      <div className="h-24 bg-gradient-to-r from-white to-neutral-900"></div>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">System</div>
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            Apply
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Brand Colors</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Primary Color</Label>
                      <div className="flex">
                        <div className="w-8 h-8 rounded-l-md bg-primary"></div>
                        <Input defaultValue="#4361ee" className="rounded-l-none font-mono" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Secondary Color</Label>
                      <div className="flex">
                        <div className="w-8 h-8 rounded-l-md bg-secondary"></div>
                        <Input defaultValue="#E2E8F0" className="rounded-l-none font-mono" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Accent Color</Label>
                      <div className="flex">
                        <div className="w-8 h-8 rounded-l-md bg-accent"></div>
                        <Input defaultValue="#E2E8F0" className="rounded-l-none font-mono" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Success Color</Label>
                      <div className="flex">
                        <div className="w-8 h-8 rounded-l-md bg-green-500"></div>
                        <Input defaultValue="#4ADE80" className="rounded-l-none font-mono" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Logo & Branding</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Logo</Label>
                      <div className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center">
                        <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded mb-2">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white font-bold text-xl">C</div>
                        </div>
                        <Button variant="outline" size="sm">
                          <i className="ri-upload-2-line mr-2"></i> Upload Logo
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Favicon</Label>
                      <div className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded mb-2">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white font-bold text-xs">C</div>
                        </div>
                        <Button variant="outline" size="sm">
                          <i className="ri-upload-2-line mr-2"></i> Upload Favicon
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button onClick={handleSaveChanges} disabled={loading}>
                    {loading ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Manage your password and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input type="password" id="current-password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input type="password" id="new-password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input type="password" id="confirm-password" />
                  </div>
                  
                  <Button>
                    Update Password
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-neutral-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch id="2fa" />
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <p className="text-sm text-neutral-700">
                      Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Login Sessions</h3>
                  
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 p-4 font-medium border-b bg-gray-50">
                      <div className="col-span-2">Device</div>
                      <div>Location</div>
                      <div>Last Active</div>
                      <div className="text-right">Actions</div>
                    </div>
                    <div className="divide-y">
                      <div className="grid grid-cols-5 p-4 items-center">
                        <div className="col-span-2 flex items-center">
                          <i className="ri-computer-line text-xl text-neutral-500 mr-3"></i>
                          <div>
                            <div className="font-medium">MacBook Pro</div>
                            <div className="text-xs text-neutral-500">Chrome on macOS</div>
                          </div>
                        </div>
                        <div>New York, USA</div>
                        <div className="text-sm">Just now</div>
                        <div className="text-right">
                          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                            Current
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 p-4 items-center">
                        <div className="col-span-2 flex items-center">
                          <i className="ri-smartphone-line text-xl text-neutral-500 mr-3"></i>
                          <div>
                            <div className="font-medium">iPhone 13</div>
                            <div className="text-xs text-neutral-500">Safari on iOS</div>
                          </div>
                        </div>
                        <div>Boston, USA</div>
                        <div className="text-sm">2 days ago</div>
                        <div className="text-right">
                          <Button variant="ghost" size="sm" className="text-red-500">
                            <i className="ri-delete-bin-line mr-2"></i> Logout
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="text-red-500">
                    <i className="ri-logout-box-r-line mr-2"></i> Logout of All Devices
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
