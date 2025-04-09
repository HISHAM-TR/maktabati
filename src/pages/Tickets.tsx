import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useTickets } from "@/App";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Ticket, TicketFormData } from "@/components/tickets/TicketTypes";
import CreateTicketDialog from "@/components/tickets/CreateTicketDialog";
import ViewTicketDialog from "@/components/tickets/ViewTicketDialog";

const Tickets = () => {
  const { user } = useAuth();
  const { tickets, addTicket, updateTicketStatus, replyToTicket } = useTickets();
  
  useEffect(() => {
    document.title = "تذاكر الدعم | نظام إدارة المكتبات";
  }, []);

  const [isCreateTicketDialogOpen, setIsCreateTicketDialogOpen] = useState(false);
  // تم إزالة حالة النافذة المنبثقة لأننا سنستخدم صفحة منفصلة لعرض التفاصيل

  const handleCreateTicket = (values: TicketFormData) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يجب تسجيل الدخول لإنشاء تذكرة دعم"
      });
      return;
    }
    
    const newTicket: Ticket = {
      id: `ticket-${Date.now()}`,
      subject: values.subject,
      description: values.description,
      status: "open",
      priority: values.priority,
      type: "technical", // يمكن تعديلها لاحقاً لتكون قابلة للاختيار
      userId: user.id,
      userName: user.name || "مستخدم",
      userEmail: user.email,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      responses: []
    };
    
    addTicket(newTicket);
    setIsCreateTicketDialogOpen(false);
    toast({
      title: "تم إنشاء تذكرة الدعم بنجاح!",
      description: "سنرد عليك في أقرب وقت ممكن."
    });
  };

  const navigate = useNavigate();

  const navigateToTicketDetails = (ticket: Ticket) => {
    navigate(`/tickets/${ticket.id}`);
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

  // فلترة التذاكر للمستخدم الحالي
  const userTickets = user ? tickets.filter(ticket => ticket.userId === user.id) : [];

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">تذاكر الدعم الفني</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              يمكنك من هنا إدارة تذاكر الدعم الفني الخاصة بك ومتابعة حالتها
            </p>
          </div>

          {user ? (
            <>
              <div className="flex justify-end mb-6">
                <Button 
                  onClick={() => setIsCreateTicketDialogOpen(true)} 
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  إنشاء تذكرة جديدة
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>تذاكر الدعم الخاصة بك</CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableCaption>قائمة تذاكر الدعم الفني الخاصة بك</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الموضوع</TableHead>
                        <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">الأولوية</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userTickets.length > 0 ? (
                        userTickets.map((ticket) => (
                          <TableRow key={ticket.id}>
                            <TableCell className="font-medium text-right">
                              <div className="flex items-center space-x-reverse space-x-2">
                                <MessageSquare className="h-4 w-4 text-primary" />
                                <span>{ticket.subject}</span>
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
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigateToTicketDetails(ticket)}
                              >
                                عرض التفاصيل
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            لا توجد تذاكر دعم فني حالياً
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center py-12">
              <Card>
                <CardContent className="pt-6 pb-6">
                  <div className="mb-4">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">يجب تسجيل الدخول</h2>
                    <p className="text-muted-foreground">
                      يرجى تسجيل الدخول لعرض تذاكر الدعم الفني الخاصة بك وإنشاء تذاكر جديدة
                    </p>
                  </div>
                  <Button 
                    onClick={() => window.location.href = "/login"}
                    className="mt-2"
                  >
                    تسجيل الدخول
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <CreateTicketDialog
        isOpen={isCreateTicketDialogOpen}
        setIsOpen={setIsCreateTicketDialogOpen}
        handleCreateTicket={handleCreateTicket}
      />

      {/* تم إزالة ViewTicketDialog واستبداله بصفحة منفصلة */}
    </div>
  );
};

export default Tickets;