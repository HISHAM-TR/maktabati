import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth, useTickets } from "@/App";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, User, Clock, CheckCircle, Send, Info, AlertCircle, RefreshCw, XCircle, Calendar, Tag, Flag, MailCheck, ArrowLeft, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const TicketDetails = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tickets, updateTicketStatus, replyToTicket, getTicket } = useTickets();
  
  const [ticket, setTicket] = useState(getTicket(ticketId || ""));
  const [replyMessage, setReplyMessage] = useState("");
  const [currentStatus, setCurrentStatus] = useState(ticket?.status || "open");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  // التحقق من وجود التذكرة وتحديث البيانات
  useEffect(() => {
    if (!ticketId || !ticket) {
      toast.error("لم يتم العثور على التذكرة");
      navigate("/tickets");
      return;
    }
    
    document.title = `تذكرة #${ticket.id.slice(0, 6)} | نظام إدارة المكتبات`;
    setCurrentStatus(ticket.status);
  }, [ticketId, ticket, navigate]);
  
  // تحديث بيانات التذكرة عند تغييرها
  useEffect(() => {
    const updatedTicket = getTicket(ticketId || "");
    if (updatedTicket) {
      setTicket(updatedTicket);
    }
  }, [tickets, ticketId, getTicket]);
  
  // التمرير التلقائي إلى آخر رسالة عند تحديث الرسائل
  useEffect(() => {
    if (ticket) {
      // تأخير للتأكد من أن الصفحة قد تم تحميلها بالكامل
      const timer = setTimeout(() => {
        const responsesArea = document.getElementById('ticket-responses-area');
        if (responsesArea) {
          responsesArea.scrollTop = responsesArea.scrollHeight;
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [ticket?.responses]);

  if (!ticket) {
    return (
      <div className="flex flex-col min-h-screen" dir="rtl">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">لم يتم العثور على التذكرة</h1>
            <Button onClick={() => navigate("/tickets")} className="mt-4">
              العودة إلى التذاكر
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleStatusChange = (status: string) => {
    setCurrentStatus(status as "open" | "in-progress" | "closed");
    updateTicketStatus(ticket.id, status as "open" | "in-progress" | "closed");
  };

  const handleReply = () => {
    if (replyMessage.trim()) {
      setIsSubmitting(true);
      replyToTicket(ticket.id, replyMessage);
      setReplyMessage("");
      
      // If the ticket is open and we're replying as admin, automatically set to in-progress
      if (currentStatus === "open" && ticket.userId !== user?.id) {
        handleStatusChange("in-progress");
      }
      
      setTimeout(() => {
        setIsSubmitting(false);
        // التمرير التلقائي إلى آخر رسالة بعد الرد
        const responsesArea = document.getElementById('ticket-responses-area');
        if (responsesArea) {
          responsesArea.scrollTop = responsesArea.scrollHeight;
        }
      }, 500);
    }
  };

  const handleCloseTicket = () => {
    handleStatusChange("closed");
    setShowConfirmClose(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-[var(--ticket-open)] text-[#1d1f2c] shadow-[0_0_10px_rgba(243,208,78,0.3)]";
      case "in-progress":
        return "bg-[var(--ticket-in-progress)] text-white shadow-[0_0_10px_rgba(74,143,197,0.3)]";
      case "closed":
        return "bg-[var(--ticket-closed)] text-white shadow-[0_0_10px_rgba(156,107,78,0.3)]";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-5 w-5 animate-pulse" />;
      case "in-progress":
        return <RefreshCw className="h-5 w-5 animate-spin-slow" />;
      case "closed":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <MessageSquare className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-[var(--priority-high)/15] text-[var(--priority-high)] border-[var(--priority-high)/30] font-semibold";
      case "medium":
        return "bg-[var(--priority-medium)/15] text-[var(--priority-medium)] border-[var(--priority-medium)/30] font-semibold";
      case "low":
        return "bg-[var(--priority-low)/15] text-[var(--priority-low)] border-[var(--priority-low)/30] font-semibold";
      default:
        return "bg-muted text-muted-foreground border-muted/50";
    }
  };

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/tickets")} 
              className="flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              العودة إلى التذاكر
            </Button>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full"
          >
            {/* رأس التذكرة */}
            <div className="p-6 border-b bg-gradient-to-r from-muted/40 to-muted/10 sticky top-0 z-10 shadow-sm rounded-t-xl">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn("p-3 rounded-full shadow-md", getStatusColor(currentStatus))}
                  >
                    {getStatusIcon(currentStatus)}
                  </motion.div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">تذكرة #{ticket.id.slice(0, 6)}</span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {ticket.createdAt}
                    </span>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge
                    variant={
                      currentStatus === "open" ? "secondary" :
                      currentStatus === "in-progress" ? "default" :
                      "outline"
                    }
                    className="px-4 py-2 text-sm rounded-full shadow-sm font-medium"
                  >
                    {currentStatus === "open" ? "جديدة" :
                    currentStatus === "in-progress" ? "قيد المعالجة" :
                    "مغلقة"}
                  </Badge>
                </motion.div>
              </div>
              <div className="mt-4 text-xl font-semibold bg-muted/20 p-3 rounded-lg border border-muted/30 shadow-sm">
                {ticket.subject}
              </div>
            </div>
            
            <div className="p-4 md:p-6 relative">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
                {/* معلومات التذكرة - الجانب */}
                <div className="col-span-1 lg:order-2 sticky top-0 lg:top-6 self-start" dir="rtl">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <Card className="shadow-md h-full overflow-hidden border border-primary/20 rounded-xl">
                      <CardHeader className="bg-gradient-to-r from-primary/10 to-muted/10 p-3 space-y-0">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          معلومات التذكرة
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 space-y-2">
                        <div className="flex flex-wrap gap-2 text-xs">
                          <div className="flex-1 min-w-[200px]">
                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                              <User className="h-3 w-3" />
                              المستخدم:
                            </div>
                            <div className="bg-muted/10 p-2 rounded-md border border-muted/30 flex items-center gap-2">
                              <Avatar className="h-5 w-5 border border-muted">
                                <AvatarFallback className="bg-primary/10 text-primary-foreground text-xs">
                                  {ticket.userName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-xs font-medium">{ticket.userName}</div>
                                <div className="text-[10px] text-muted-foreground break-all">
                                  {ticket.userEmail}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-[150px]">
                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                              <Clock className="h-3 w-3" />
                              التاريخ:
                            </div>
                            <div className="bg-muted/10 p-2 rounded-md border border-muted/30">
                              <div className="flex items-center gap-1 text-xs">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span>أنشئت: {ticket.createdAt}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <RefreshCw className="h-3 w-3 text-muted-foreground" />
                                <span>آخر تحديث: {ticket.updatedAt}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 w-full">
                            <div className="flex-1">
                              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                <Flag className="h-3 w-3" />
                                الأولوية:
                              </div>
                              <div className={cn(
                                "w-full justify-center py-1 px-2 rounded-md border flex items-center gap-1 text-xs",
                                getPriorityColor(ticket.priority)
                              )}>
                                {ticket.priority === "high" ? (
                                  <>
                                    <AlertCircle className="h-3 w-3" />
                                    <span>عالية</span>
                                  </>
                                ) : ticket.priority === "medium" ? (
                                  <>
                                    <Info className="h-3 w-3" />
                                    <span>متوسطة</span>
                                  </>
                                ) : (
                                  <>
                                    <ArrowRight className="h-3 w-3" />
                                    <span>منخفضة</span>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                <Tag className="h-3 w-3" />
                                النوع:
                              </div>
                              <div className="w-full justify-center py-1 px-2 rounded-md border border-muted/50 bg-muted/10 flex items-center gap-1 text-xs">
                                {ticket.type === "technical" ? (
                                  <>
                                    <RefreshCw className="h-3 w-3" />
                                    <span>فنية</span>
                                  </>
                                ) : ticket.type === "account" ? (
                                  <>
                                    <User className="h-3 w-3" />
                                    <span>حساب</span>
                                  </>
                                ) : ticket.type === "payment" ? (
                                  <>
                                    <MailCheck className="h-3 w-3" />
                                    <span>دفع</span>
                                  </>
                                ) : (
                                  <>
                                    <Info className="h-3 w-3" />
                                    <span>أخرى</span>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                <RefreshCw className="h-3 w-3" />
                                الحالة:
                              </div>
                              {ticket.userId === user?.id ? (
                                <div className="w-full justify-center py-1 px-2 rounded-md border border-muted/50 bg-muted/10 flex items-center gap-1 text-xs">
                                  {currentStatus === "open" ? (
                                    <>
                                      <AlertCircle className="h-3 w-3" />
                                      <span>جديدة</span>
                                    </>
                                  ) : currentStatus === "in-progress" ? (
                                    <>
                                      <RefreshCw className="h-3 w-3" />
                                      <span>قيد المعالجة</span>
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="h-3 w-3" />
                                      <span>مغلقة</span>
                                    </>
                                  )}
                                </div>
                              ) : (
                                <Select
                                  value={currentStatus}
                                  onValueChange={handleStatusChange}
                                  disabled={currentStatus === "closed"}
                                >
                                  <SelectTrigger className="w-full h-7 text-xs">
                                    <SelectValue placeholder="الحالة" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="open">جديدة</SelectItem>
                                    <SelectItem value="in-progress">قيد المعالجة</SelectItem>
                                    <SelectItem value="closed">مغلقة</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
                
                {/* محتوى التذكرة - الرئيسي */}
                <div className="col-span-1 lg:col-span-3 lg:order-1 flex flex-col overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6 flex-1 overflow-hidden flex flex-col"
                  >
                    <Card className="border border-muted/50 shadow-sm overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-primary/10 to-muted/10 p-4 space-y-0">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          تفاصيل المشكلة
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="bg-gradient-to-br from-muted/20 to-muted/5 p-5 rounded-xl whitespace-pre-wrap border border-muted/30 shadow-inner text-base">
                          {ticket.description}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-muted/50 shadow-sm flex-1 overflow-hidden flex flex-col">
                      <CardHeader className="bg-gradient-to-r from-primary/10 to-muted/10 p-4 space-y-0">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          المحادثة
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
                        <ScrollArea className="flex-1 w-full p-4 max-h-[350px]" id="ticket-responses-area">
                          <div className="space-y-4">
                            {ticket.responses && ticket.responses.length > 0 ? (
                              // تجميع الرسائل حسب المرسل (المستخدم أو الدعم الفني)
                              ticket.responses.reduce((groups, response, index) => {
                                const lastGroup = groups[groups.length - 1];
                                
                                // إذا كانت المجموعة الأخيرة من نفس نوع المرسل، أضف الرسالة إليها
                                if (lastGroup && lastGroup.isAdmin === response.isAdmin) {
                                  lastGroup.messages.push(response);
                                } else {
                                  // إنشاء مجموعة جديدة
                                  groups.push({
                                    isAdmin: response.isAdmin,
                                    messages: [response]
                                  });
                                }
                                return groups;
                              }, [] as {isAdmin: boolean, messages: typeof ticket.responses}[]).map((group, groupIndex) => (
                                <motion.div 
                                  key={groupIndex}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
                                  className={cn(
                                    "flex flex-col gap-2",
                                    group.isAdmin ? "items-start" : "items-end"
                                  )}
                                >
                                  {group.messages.map((response, responseIndex) => (
                                    <div 
                                      key={response.id} 
                                      className={cn(
                                        "max-w-[80%] rounded-xl p-3 shadow-sm",
                                        group.isAdmin 
                                          ? "bg-muted/20 border border-muted/30 rounded-tr-none" 
                                          : "bg-primary/10 border border-primary/20 rounded-tl-none"
                                      )}
                                    >
                                      <div className="flex items-center gap-2 mb-1">
                                        <Avatar className="h-6 w-6">
                                          <AvatarFallback className={cn(
                                            "text-xs",
                                            group.isAdmin 
                                              ? "bg-primary text-primary-foreground" 
                                              : "bg-secondary text-secondary-foreground"
                                          )}>
                                            {response.userName.charAt(0)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                          <span className="text-xs font-medium">
                                            {/* تمييز اسم المرسل بوضوح */}
                                            {group.isAdmin ? (
                                              <span className="flex items-center gap-1">
                                                <Badge variant="outline" className="px-1 py-0 text-[9px] bg-primary/5">
                                                  فريق الدعم
                                                </Badge>
                                              </span>
                                            ) : (
                                              <span className="flex items-center gap-1">
                                                <Badge variant="outline" className="px-1 py-0 text-[9px] bg-secondary/5">
                                                  المستخدم
                                                </Badge>
                                                {response.userName}
                                              </span>
                                            )}
                                          </span>
                                          <span className="text-[10px] text-muted-foreground">{response.createdAt}</span>
                                        </div>
                                      </div>
                                      <div className="whitespace-pre-wrap text-sm mt-1">{response.message}</div>
                                    </div>
                                  ))}
                                </motion.div>
                              ))
                            ) : (
                              <div className="text-center py-8 text-muted-foreground">
                                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                <p>لا توجد ردود بعد</p>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                        
                        {currentStatus !== "closed" && (
                          <div className="p-4 border-t bg-muted/10">
                            <div className="flex flex-col gap-3">
                              <Textarea 
                                placeholder="اكتب ردك هنا..."
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                className="min-h-[100px] resize-none focus-visible:ring-primary"
                              />
                              <div className="flex justify-between items-center">
                                {/* إظهار زر إغلاق التذكرة فقط للمشرفين */}
                                {(user?.role === "admin" || user?.role === "owner" || user?.role === "moderator") && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setShowConfirmClose(true)}
                                    disabled={currentStatus === "closed"}
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    إغلاق التذكرة
                                  </Button>
                                )}
                                {/* إظهار مساحة فارغة للمستخدمين العاديين */}
                                {!(user?.role === "admin" || user?.role === "owner" || user?.role === "moderator") && (
                                  <div></div>
                                )}
                                <Button 
                                  onClick={handleReply} 
                                  disabled={!replyMessage.trim() || isSubmitting}
                                  className="flex items-center gap-2"
                                >
                                  {isSubmitting ? (
                                    <>
                                      <RefreshCw className="h-4 w-4 animate-spin" />
                                      جاري الإرسال...
                                    </>
                                  ) : (
                                    <>
                                      <Send className="h-4 w-4" />
                                      إرسال الرد
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {showConfirmClose && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="max-w-md w-full">
                <CardHeader>
                  <CardTitle>تأكيد إغلاق التذكرة</CardTitle>
                  <CardDescription>
                    هل أنت متأكد من رغبتك في إغلاق هذه التذكرة؟ لن تتمكن من إضافة ردود جديدة بعد الإغلاق.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowConfirmClose(false)}>
                    إلغاء
                  </Button>
                  <Button variant="destructive" onClick={handleCloseTicket}>
                    إغلاق التذكرة
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TicketDetails;