
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AlertTriangle, Send, MessageSquare, Flag, Tag, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { TicketFormData } from "./TicketTypes";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface CreateTicketDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleCreateTicket: (values: TicketFormData) => void;
}

const CreateTicketDialog = ({
  isOpen,
  setIsOpen,
  handleCreateTicket,
}: CreateTicketDialogProps) => {
  const form = useForm<TicketFormData>({
    defaultValues: {
      subject: "",
      description: "",
      priority: "medium"
    }
  });

  const onSubmit = (values: TicketFormData) => {
    handleCreateTicket(values);
    form.reset();
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitWithAnimation = async (values: TicketFormData) => {
    setIsSubmitting(true);
    try {
      await handleCreateTicket(values);
      form.reset();
    } finally {
      setTimeout(() => setIsSubmitting(false), 500);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-warning/10 text-warning-foreground border-warning/20";
      case "low":
        return "bg-muted text-muted-foreground border-muted/50";
      default:
        return "bg-muted text-muted-foreground border-muted/50";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="rtl:text-right ltr:text-left max-w-2xl rounded-xl shadow-lg border-0 p-0 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col h-full"
        >
          <DialogHeader className="p-6 border-b bg-muted/30 sticky top-0 z-10">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-primary text-primary-foreground"
              >
                <MessageSquare className="h-5 w-5" />
              </motion.div>
              إنشاء تذكرة دعم جديدة
            </DialogTitle>
            <DialogDescription className="mt-2">
              يرجى تقديم تفاصيل المشكلة التي تواجهها وسنقوم بالرد في أقرب وقت ممكن.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitWithAnimation)} className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Card className="shadow-sm border border-muted/50 overflow-hidden">
                    <CardHeader className="bg-muted/20 p-4 space-y-0">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        معلومات التذكرة
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 space-y-5">
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                              <Tag className="h-4 w-4" />
                              الموضوع
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="أدخل عنوان المشكلة" 
                                {...field} 
                                className="focus-visible:ring-primary focus-visible:ring-offset-1 transition-all duration-200 border-muted/50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                              <MessageSquare className="h-4 w-4" />
                              وصف المشكلة
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="اشرح المشكلة التي تواجهها بالتفصيل..." 
                                className="min-h-[150px] text-base resize-none focus-visible:ring-primary focus-visible:ring-offset-1 transition-all duration-200 border-muted/50" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                              <Flag className="h-4 w-4" />
                              الأولوية
                            </FormLabel>
                            <div className="grid grid-cols-3 gap-3">
                              {["low", "medium", "high"].map((priority) => (
                                <motion.div 
                                  key={priority}
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => field.onChange(priority)}
                                >
                                  <div 
                                    className={cn(
                                      "w-full py-2.5 px-3 rounded-lg border flex items-center justify-center gap-2 cursor-pointer transition-all",
                                      getPriorityColor(priority),
                                      field.value === priority ? "ring-2 ring-primary ring-offset-1" : ""
                                    )}
                                  >
                                    {priority === "high" ? (
                                      <>
                                        <AlertTriangle className="h-3.5 w-3.5" />
                                        <span>عالية</span>
                                      </>
                                    ) : priority === "medium" ? (
                                      <>
                                        <Flag className="h-3.5 w-3.5" />
                                        <span>متوسطة</span>
                                      </>
                                    ) : (
                                      <>
                                        <Tag className="h-3.5 w-3.5" />
                                        <span>منخفضة</span>
                                      </>
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                            <input type="hidden" {...field} />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-amber-50 p-4 rounded-lg border border-amber-200 flex items-start space-x-reverse space-x-2"
                >
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-800 text-sm">
                    سيتم الرد على تذكرتك في أقرب وقت ممكن. الوقت المتوقع للرد هو 24-48 ساعة عمل.
                  </p>
                </motion.div>
                
                <Separator className="my-4" />
                
                <DialogFooter className="flex flex-wrap justify-end items-center gap-3 mt-4 pt-0">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      type="button"
                      className="rounded-full px-4"
                    >
                      إلغاء
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-full px-5 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          إرسال التذكرة
                        </>
                      )}
                    </Button>
                  </motion.div>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketDialog;
