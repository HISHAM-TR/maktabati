
import React, { useState } from "react";
import { MessageSquare, AlertCircle, Filter, CheckCircle, Clock } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import SearchBar from "@/components/ui/SearchBar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ticket } from "../tickets/TicketTypes";
import ViewTicketDialog from "../tickets/ViewTicketDialog";

interface TicketsTabProps {
  tickets: Ticket[];
  updateTicketStatus: (ticketId: string, status: "open" | "in-progress" | "closed") => void;
  replyToTicket: (ticketId: string, message: string) => void;
}

const TicketsTab = ({ tickets, updateTicketStatus, replyToTicket }: TicketsTabProps) => {
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(tickets);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

  const applyFilters = () => {
    let filtered = [...tickets];
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }
    
    if (priorityFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }
    
    if (typeFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.type === typeFilter);
    }
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        ticket => 
          ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredTickets(filtered);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setTimeout(applyFilters, 0);
  };

  const handlePriorityFilterChange = (value: string) => {
    setPriorityFilter(value);
    setTimeout(applyFilters, 0);
  };
  
  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
    setTimeout(applyFilters, 0);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setTimeout(applyFilters, 0);
  };

  const openViewTicketDialog = (ticket: Ticket) => {
    setActiveTicket(ticket);
    setIsViewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="secondary" className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> جديدة</Badge>;
      case "in-progress":
        return <Badge variant="default" className="flex items-center gap-1"><Clock className="h-3 w-3" /> قيد المعالجة</Badge>;
      case "closed":
        return <Badge variant="outline" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> مغلقة</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">عالية</Badge>;
      case "medium":
        return <Badge variant="default">متوسطة</Badge>;
      case "low":
        return <Badge variant="outline">منخفضة</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex-1 w-full">
          <SearchBar
            onSearch={handleSearch}
            placeholder="ابحث في التذاكر..."
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="w-40">
              <Select
                value={statusFilter}
                onValueChange={handleStatusFilterChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="open">جديدة</SelectItem>
                  <SelectItem value="in-progress">قيد المعالجة</SelectItem>
                  <SelectItem value="closed">مغلقة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <div className="w-40">
              <Select
                value={priorityFilter}
                onValueChange={handlePriorityFilterChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="الأولوية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأولويات</SelectItem>
                  <SelectItem value="high">عالية</SelectItem>
                  <SelectItem value="medium">متوسطة</SelectItem>
                  <SelectItem value="low">منخفضة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <div className="w-40">
              <Select
                value={typeFilter}
                onValueChange={handleTypeFilterChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="technical">فنية</SelectItem>
                  <SelectItem value="account">حساب</SelectItem>
                  <SelectItem value="payment">دفع</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table className="w-full">
            <TableCaption>قائمة تذاكر الدعم الفني</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الموضوع</TableHead>
                <TableHead className="text-right">المستخدم</TableHead>
                <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الأولوية</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium text-right">
                      <div className="flex items-center space-x-reverse space-x-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <span>{ticket.subject}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div>
                        <div>{ticket.userName}</div>
                        <div className="text-xs text-muted-foreground">{ticket.userEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="text-sm">{ticket.createdAt}</div>
                      <div className="text-xs text-muted-foreground">
                        {ticket.updatedAt !== ticket.createdAt && `تحديث: ${ticket.updatedAt}`}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {getStatusBadge(ticket.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      {getPriorityBadge(ticket.priority)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">
                        {ticket.type === "technical" ? "فنية" :
                         ticket.type === "account" ? "حساب" :
                         ticket.type === "payment" ? "دفع" : "أخرى"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex space-x-reverse space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openViewTicketDialog(ticket)}
                        >
                          عرض وإجابة
                        </Button>
                        {ticket.status !== "closed" && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => updateTicketStatus(ticket.id, "closed")}
                          >
                            إغلاق
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    لا توجد تذاكر تطابق معايير البحث
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {activeTicket && (
        <ViewTicketDialog
          isOpen={isViewDialogOpen}
          setIsOpen={setIsViewDialogOpen}
          ticket={activeTicket}
          updateTicketStatus={updateTicketStatus}
          replyToTicket={replyToTicket}
        />
      )}
    </div>
  );
};

export default TicketsTab;
