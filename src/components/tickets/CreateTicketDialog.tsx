
import React from "react";
import { useForm } from "react-hook-form";
import { AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { TicketFormData } from "./TicketTypes";

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="rtl:text-right ltr:text-left">
        <DialogHeader>
          <DialogTitle>إنشاء تذكرة دعم جديدة</DialogTitle>
          <DialogDescription>
            يرجى تقديم تفاصيل المشكلة التي تواجهها وسنقوم بالرد في أقرب وقت ممكن.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الموضوع</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل عنوان المشكلة" {...field} />
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
                  <FormLabel>وصف المشكلة</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="اشرح المشكلة التي تواجهها بالتفصيل..." 
                      className="h-32" 
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
                  <FormLabel>الأولوية</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر أولوية التذكرة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">منخفضة</SelectItem>
                      <SelectItem value="medium">متوسطة</SelectItem>
                      <SelectItem value="high">عالية</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="bg-amber-50 p-3 rounded-md border border-amber-200 flex items-start space-x-reverse space-x-2 mt-4">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800 text-sm">
                سيتم الرد على تذكرتك في أقرب وقت ممكن. الوقت المتوقع للرد هو 24-48 ساعة عمل.
              </p>
            </div>
            
            <DialogFooter className="flex-row-reverse sm:justify-start">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                إلغاء
              </Button>
              <Button type="submit">إرسال التذكرة</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketDialog;
