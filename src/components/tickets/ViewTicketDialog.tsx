
import React, { useState, useEffect } from "react";
import { useAuth } from "@/App";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, User, Clock, CheckCircle, Send, Info, AlertCircle, RefreshCw, XCircle, Calendar, Tag, Flag, MailCheck, ArrowLeft, ArrowRight } from "lucide-react";
import { Ticket } from "./TicketTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

interface ViewTicketDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  ticket: Ticket;
  updateTicketStatus: (ticketId: string, status: "open" | "in-progress" | "closed") => void;
  replyToTicket: (ticketId: string, message: string) => void;
}

const ViewTicketDialog = ({
  isOpen,
  setIsOpen,
  ticket,
  updateTicketStatus,
  replyToTicket,
}: ViewTicketDialogProps) => {
  const { user } = useAuth();
  const [replyMessage, setReplyMessage] = useState("");
  const [currentStatus, setCurrentStatus] = useState(ticket.status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  // تحديث حالة التذكرة عند تغيير البيانات
  useEffect(() => {
    setCurrentStatus(ticket.status);
  }, [ticket.status]);
  
  // التمرير التلقائي إلى آخر رسالة عند فتح النافذة أو تحديث الرسائل
  useEffect(() => {
    if (isOpen) {
      // تأخير للتأكد من أن النافذة قد تم تحميلها بالكامل
      const timer = setTimeout(() => {
        const responsesArea = document.getElementById('ticket-responses-area');
        if (responsesArea) {
          responsesArea.scrollTop = responsesArea.scrollHeight;
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, ticket.responses]);

  const handleStatusChange = (status: string) => {
    setCurrentStatus(status as "open" | "in-progress" | "closed");
    updateTicketStatus(ticket.id, status as "open" | "in-progress" | "closed");
    // لا نقوم بإغلاق النافذة عند تغيير الحالة
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
      
      // Keep the dialog open after reply - إبقاء النافذة مفتوحة بعد الرد
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
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && currentStatus !== "closed" && showConfirmClose) {
        // إذا كان المستخدم يحاول إغلاق النافذة وكانت التذكرة غير مغلقة، نعرض تأكيد
        setShowConfirmClose(true);
        return;
      }
      setShowConfirmClose(false);
      setIsOpen(open);
    }}>
      <DialogContent dir="rtl" className="rtl:text-right ltr:text-left max-w-full max-h-[90vh] flex flex-col overflow-hidden rounded-2xl shadow-xl border-0 p-0 relative fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-[95%] sm:w-[90%] md:w-[85%] lg:w-[75%] xl:w-[65%] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 bg-gradient-to-b from-background to-muted/20">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col h-full"
        >
          {/* رأس التذكرة */}
          <DialogHeader className="p-6 border-b bg-gradient-to-r from-muted/40 to-muted/10 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <DialogTitle className="flex items-center gap-3">
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
              </DialogTitle>
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
            <DialogDescription className="mt-4 text-xl font-semibold bg-muted/20 p-3 rounded-lg border border-muted/30 shadow-sm">
              {ticket.subject}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto p-4 md:p-6 relative">
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
                                className={`flex ${group.isAdmin ? "justify-start" : "justify-end"}`}
                              >
                                <div 
                                  className={`max-w-[85%] rounded-xl p-4 shadow-md ${
                                    group.isAdmin 
                                      ? "bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 text-primary-foreground" 
                                      : "bg-gradient-to-br from-muted/40 to-muted/20 border border-muted/50"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    {group.isAdmin ? (
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                            <Info className="h-3 w-3" />
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium text-sm">الدعم الفني</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                          <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                                            {group.messages[0].userName.charAt(0)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium text-sm">{group.messages[0].userName}</span>
                                      </div>
                                    )}
                                    <span className="text-xs opacity-70 mr-auto">{group.messages[0].createdAt}</span>
                                  </div>
                                  <div className="space-y-2">
                                    {group.messages.map((message, msgIndex) => (
                                      <div key={message.id} className="whitespace-pre-wrap text-sm border-b last:border-0 pb-2 last:pb-0 border-muted/20">
                                        {message.message}
                                        {msgIndex < group.messages.length - 1 && (
                                          <div className="text-xs text-muted-foreground mt-1 text-left">
                                            {message.createdAt}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                              className="flex flex-col items-center justify-center h-32 text-muted-foreground"
                            >
                              <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
                              <span>لا توجد ردود على هذه التذكرة بعد</span>
                            </motion.div>
                          )}
                        </div>
                      </ScrollArea>
                      
                      {/* صندوق الرد - تم تحسينه ليكون أكثر وضوحاً وبروزاً */}
                      {currentStatus !== "closed" && (
                        <motion.div
                          id="reply-section"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          className="p-5 bg-gradient-to-b from-background to-muted/20 border-t border-primary/20 shadow-inner"
                        >
                          <div className="space-y-3">
                            <h4 className="text-base font-medium flex items-center gap-2 text-primary">
                              <MessageSquare className="h-5 w-5" />
                              <span className="animate-pulse">الرد على التذكرة</span>
                            </h4>
                            <div className="relative group">
                              <Textarea
                                placeholder="اكتب ردك هنا..."
                                className="min-h-[80px] text-base w-full resize-none focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-300 border-primary/30 rounded-xl shadow-sm group-hover:border-primary/50 p-4"
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                              />
                              <div className="absolute bottom-3 left-3 opacity-70 text-xs">
                                {replyMessage.length > 0 ? `${replyMessage.length} حرف` : ""}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap justify-between items-center gap-3 mt-4">
                            <div className="flex items-center gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setShowConfirmClose(true)}
                                        className="flex items-center gap-2 rounded-full px-4 shadow-sm"
                                      >
                                        <XCircle className="h-4 w-4" />
                                        إغلاق التذكرة
                                      </Button>
                                    </motion.div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>إغلاق التذكرة نهائياً</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                  variant="outline"
                                  onClick={() => setIsOpen(false)}
                                  className="rounded-full px-4 shadow-sm"
                                >
                                  إغلاق النافذة
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button 
                                  onClick={handleReply}
                                  disabled={!replyMessage.trim() || isSubmitting}
                                  className="flex items-center gap-2 min-w-[140px] rounded-full px-5 py-6 bg-primary hover:bg-primary/90 shadow-md transition-all duration-300 text-base font-medium"
                                >
                                  {isSubmitting ? (
                                    <>
                                      <RefreshCw className="h-5 w-5 animate-spin" />
                                      جاري الإرسال...
                                    </>
                                  ) : (
                                    <>
                                      <Send className="h-5 w-5" />
                                      إرسال الرد
                                    </>
                                  )}
                                </Button>
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
          
          <Separator className="my-0" />
        
        </motion.div>
        
        {/* نافذة تأكيد إغلاق التذكرة */}
        <AnimatePresence>
          {showConfirmClose && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Card className="w-full max-w-md shadow-lg border border-destructive/20">
                  <CardHeader className="pb-2">
                    <div className="flex justify-center mb-2">
                      <div className="p-3 rounded-full bg-destructive/10 text-destructive">
                        <XCircle className="h-8 w-8" />
                      </div>
                    </div>
                    <CardTitle className="text-center text-lg font-semibold">تأكيد إغلاق التذكرة</CardTitle>
                    <CardDescription className="text-center">
                      هل أنت متأكد من رغبتك في إغلاق هذه التذكرة؟ لن يتمكن المستخدم من إضافة ردود جديدة بعد الإغلاق.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex items-center gap-3 justify-center pt-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline" 
                        className="flex-1 min-w-[120px] rounded-full"
                        onClick={() => setShowConfirmClose(false)}
                      >
                        إلغاء
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="destructive" 
                        className="flex-1 min-w-[120px] rounded-full"
                        onClick={handleCloseTicket}
                      >
                        <CheckCircle className="h-4 w-4 ml-2" />
                        تأكيد الإغلاق
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTicketDialog;
