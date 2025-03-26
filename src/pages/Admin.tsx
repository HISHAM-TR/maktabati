
import { useEffect, useState } from "react";
import {
  Users,
  Library,
  BookOpen,
  BarChart,
  User,
  Calendar,
  Mail,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import SearchBar from "@/components/ui/SearchBar";

// Mock data for users
const initialUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    registrationDate: "2023-01-15",
    lastLogin: "2023-06-20",
    libraryCount: 3,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "active",
    registrationDate: "2023-02-10",
    lastLogin: "2023-06-18",
    libraryCount: 2,
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "inactive",
    registrationDate: "2023-03-05",
    lastLogin: "2023-05-12",
    libraryCount: 1,
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    status: "active",
    registrationDate: "2023-04-20",
    lastLogin: "2023-06-21",
    libraryCount: 4,
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael@example.com",
    status: "pending",
    registrationDate: "2023-06-15",
    lastLogin: "-",
    libraryCount: 0,
  },
];

// Mock data for libraries
const initialLibrariesData = [
  {
    id: "1",
    name: "Fiction Collection",
    owner: "John Doe",
    ownerEmail: "john@example.com",
    bookCount: 42,
    creationDate: "2023-02-10",
  },
  {
    id: "2",
    name: "Tech Books",
    owner: "John Doe",
    ownerEmail: "john@example.com",
    bookCount: 17,
    creationDate: "2023-03-15",
  },
  {
    id: "3",
    name: "Philosophy",
    owner: "John Doe",
    ownerEmail: "john@example.com",
    bookCount: 8,
    creationDate: "2023-04-20",
  },
  {
    id: "4",
    name: "Classic Literature",
    owner: "Jane Smith",
    ownerEmail: "jane@example.com",
    bookCount: 25,
    creationDate: "2023-02-28",
  },
  {
    id: "5",
    name: "Science",
    owner: "Jane Smith",
    ownerEmail: "jane@example.com",
    bookCount: 13,
    creationDate: "2023-05-05",
  },
  {
    id: "6",
    name: "History Books",
    owner: "Bob Johnson",
    ownerEmail: "bob@example.com",
    bookCount: 9,
    creationDate: "2023-04-12",
  },
  {
    id: "7",
    name: "Cooking Recipes",
    owner: "Sarah Williams",
    ownerEmail: "sarah@example.com",
    bookCount: 16,
    creationDate: "2023-03-10",
  },
  {
    id: "8",
    name: "Travel Guides",
    owner: "Sarah Williams",
    ownerEmail: "sarah@example.com",
    bookCount: 11,
    creationDate: "2023-04-05",
  },
  {
    id: "9",
    name: "Poetry Collection",
    owner: "Sarah Williams",
    ownerEmail: "sarah@example.com",
    bookCount: 22,
    creationDate: "2023-05-15",
  },
  {
    id: "10",
    name: "Art Books",
    owner: "Sarah Williams",
    ownerEmail: "sarah@example.com",
    bookCount: 7,
    creationDate: "2023-06-01",
  },
];

const Admin = () => {
  const [users, setUsers] = useState(initialUsers);
  const [libraries, setLibraries] = useState(initialLibrariesData);
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
  const [filteredLibraries, setFilteredLibraries] = useState(initialLibrariesData);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeUser, setActiveUser] = useState<any>(null);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    status: "",
  });

  // Set title on mount
  useEffect(() => {
    document.title = "Admin Panel | Library Management System";
  }, []);

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.status === "active").length;
  const totalLibraries = libraries.length;
  const totalBooks = libraries.reduce((sum, lib) => sum + lib.bookCount, 0);

  // Handle user search
  const handleUserSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }

    const results = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredUsers(results);
  };

  // Handle library search
  const handleLibrarySearch = (query: string) => {
    if (!query.trim()) {
      setFilteredLibraries(libraries);
      return;
    }

    const results = libraries.filter(
      (library) =>
        library.name.toLowerCase().includes(query.toLowerCase()) ||
        library.owner.toLowerCase().includes(query.toLowerCase()) ||
        library.ownerEmail.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredLibraries(results);
  };

  // Edit user
  const openEditUserDialog = (user: any) => {
    setActiveUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      status: user.status,
    });
    setIsEditUserDialogOpen(true);
  };

  const handleEditUser = () => {
    if (!activeUser) return;
    if (!userFormData.name.trim() || !userFormData.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    const updatedUsers = users.map((user) =>
      user.id === activeUser.id
        ? { ...user, ...userFormData }
        : user
    );

    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setIsEditUserDialogOpen(false);
    setActiveUser(null);
    toast.success("User updated successfully");
  };

  // Toggle user status
  const toggleUserStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, status: newStatus } : user
    );

    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    toast.success(`User status changed to ${newStatus}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="libraries">Libraries</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalUsers}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activeUsers} active users
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Libraries
                    </CardTitle>
                    <Library className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalLibraries}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Across {activeUsers} users
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Books
                    </CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalBooks}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Avg. {(totalBooks / totalLibraries).toFixed(1)} per library
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      User Growth
                    </CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+{totalUsers}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      In the last 30 days
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Registration</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.slice(0, 5).map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              {user.name}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  user.status === "active"
                                    ? "default"
                                    : user.status === "inactive"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.registrationDate}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Libraries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Books</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {libraries.slice(0, 5).map((library) => (
                          <TableRow key={library.id}>
                            <TableCell className="font-medium">
                              {library.name}
                            </TableCell>
                            <TableCell>{library.owner}</TableCell>
                            <TableCell>{library.bookCount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="animate-fade-in">
              <div className="mb-6">
                <SearchBar
                  onSearch={handleUserSearch}
                  placeholder="Search users by name or email..."
                />
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableCaption>List of all registered users</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Libraries</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <span>{user.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.status === "active"
                                  ? "default"
                                  : user.status === "inactive"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{user.registrationDate}</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.lastLogin}</TableCell>
                          <TableCell>{user.libraryCount}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditUserDialog(user)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant={
                                  user.status === "active"
                                    ? "destructive"
                                    : "default"
                                }
                                size="sm"
                                onClick={() =>
                                  toggleUserStatus(user.id, user.status)
                                }
                              >
                                {user.status === "active" ? (
                                  <>
                                    <X className="h-4 w-4 mr-1" />
                                    Disable
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-4 w-4 mr-1" />
                                    Enable
                                  </>
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Libraries Tab */}
            <TabsContent value="libraries" className="animate-fade-in">
              <div className="mb-6">
                <SearchBar
                  onSearch={handleLibrarySearch}
                  placeholder="Search libraries by name or owner..."
                />
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableCaption>List of all libraries</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Books</TableHead>
                        <TableHead>Creation Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLibraries.map((library) => (
                        <TableRow key={library.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Library className="h-4 w-4 text-primary" />
                              </div>
                              <span>{library.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{library.owner}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {library.ownerEmail}
                            </div>
                          </TableCell>
                          <TableCell>{library.bookCount}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{library.creationDate}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Edit User Dialog */}
      <Dialog
        open={isEditUserDialogOpen}
        onOpenChange={setIsEditUserDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={userFormData.name}
                onChange={(e) =>
                  setUserFormData({ ...userFormData, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Input
                  id="email"
                  value={userFormData.email}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, email: e.target.value })
                  }
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    toast.success("Verification email sent");
                  }}
                  title="Send verification email"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Badge
                  variant={
                    userFormData.status === "active"
                      ? "default"
                      : userFormData.status === "inactive"
                      ? "secondary"
                      : "outline"
                  }
                  className="py-1 px-2"
                >
                  {userFormData.status}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newStatus =
                      userFormData.status === "active"
                        ? "inactive"
                        : "active";
                    setUserFormData({ ...userFormData, status: newStatus });
                  }}
                >
                  Toggle Status
                </Button>
                {userFormData.status === "pending" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setUserFormData({ ...userFormData, status: "active" });
                      toast.success("User activation email sent");
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <AlertCircle className="h-4 w-4 text-destructive inline mr-2" />
              </div>
              <div className="col-span-3">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    toast.success("Password reset email sent to user");
                  }}
                >
                  Send Password Reset
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditUserDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
