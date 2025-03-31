
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, User, Clock, CheckCircle, Send, Info, AlertCircle } from "lucide-react";
import { Ticket } from "./TicketTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [replyMessage, setReplyMessage] = useState("");
  const [currentStatus, setCurrentStatus] = useState(ticket.status);

  const handleStatusChange = (status: string) => {
    setCurrentStatus(status as "open" | "in-progress" | "closed");
    updateTicketStatus(ticket.id, status as "open" | "in-progress" | "closed");
  };

  const handleReply = () => {
    if (replyMessage.trim()) {
      replyToTicket(ticket.id, replyMessage);
      setReplyMessage("");
      
      // If the ticket is open and we're replying, automatically set to in-progress
      if (currentStatus === "open") {
        handleStatusChange("in-progress");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="rtl:text-right ltr:text-left max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <span>تذكرة رقم #{ticket.id.slice(0, 8)}</span>
            <Badge
              variant={
                currentStatus === "open" ? "secondary" :
                currentStatus === "in-progress" ? "default" :
                "outline"
              }
              className="mr-2"
            >
              {currentStatus === "open" ? "جديدة" :
               currentStatus === "in-progress" ? "قيد المعالجة" :
               "مغلقة"}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-lg font-semibold">
            {ticket.subject}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-2">
          <div className="col-span-1">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">معلومات المستخدم</h4>
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{ticket.userName}</span>
                  </div>
                  <div className="text-sm text-muted-foreground break-all">
                    {ticket.userEmail}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">التاريخ</h4>
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">أنشئت: {ticket.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">آخر تحديث: {ticket.updatedAt}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">الأولوية</h4>
                <Badge
                  variant={
                    ticket.priority === "high" ? "destructive" :
                    ticket.priority === "medium" ? "default" :
                    "outline"
                  }
                >
                  {ticket.priority === "high" ? "عالية" :
                   ticket.priority === "medium" ? "متوسطة" :
                   "منخفضة"}
                </Badge>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">الحالة</h4>
                <Select
                  value={currentStatus}
                  onValueChange={handleStatusChange}
                  disabled={currentStatus === "closed"}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">جديدة</SelectItem>
                    <SelectItem value="in-progress">قيد المعالجة</SelectItem>
                    <SelectItem value="closed">مغلقة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">تفاصيل المشكلة</h4>
                <div className="bg-muted/50 p-3 rounded-md whitespace-pre-wrap">
                  {ticket.description}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium mb-1">المحادثة</h4>
                <ScrollArea className="h-48 rounded-md border">
                  <div className="p-4 space-y-4">
                    {ticket.responses && ticket.responses.length > 0 ? (
                      ticket.responses.map((response) => (
                        <div 
                          key={response.id}
                          className={`flex ${response.isAdmin ? "justify-start" : "justify-end"}`}
                        >
                          <div 
                            className={`max-w-[80%] rounded-lg p-3 ${
                              response.isAdmin 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-muted"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1 text-xs">
                              {response.isAdmin ? (
                                <><Info className="h-3 w-3" /> <span>الدعم الفني</span></>
                              ) : (
                                <><User className="h-3 w-3" /> <span>{response.userName}</span></>
                              )}
                              <span className="text-xs opacity-70">{response.createdAt}</span>
                            </div>
                            <div className="whitespace-pre-wrap">
                              {response.message}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-32 text-muted-foreground">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        <span>لا توجد ردود على هذه التذكرة بعد</span>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-2" />
        
        {currentStatus !== "closed" ? (
          <>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">الرد على التذكرة</h4>
              <Textarea
                placeholder="اكتب ردك هنا..."
                className="min-h-[100px]"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
            </div>
            
            <DialogFooter className="flex-row-reverse sm:justify-start gap-2 mt-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                إغلاق
              </Button>
              <Button 
                onClick={handleReply}
                disabled={!replyMessage.trim()}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                إرسال الرد
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleStatusChange("closed")}
              >
                <CheckCircle className="h-4 w-4 ml-2" />
                إغلاق التذكرة
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="mt-2 flex justify-end">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              إغلاق
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewTicketDialog;
