
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, AlertCircle, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "البريد الإلكتروني مطلوب" })
    .email({ message: "البريد الإلكتروني غير صحيح" }),
});

interface ForgotPasswordDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ForgotPasswordDialog = ({ isOpen, setIsOpen }: ForgotPasswordDialogProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitEmail, setSubmitEmail] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Here we would usually call an API to handle password reset
      // For now, we're simulating a successful API call
      console.log("Sending password reset email to:", values.email);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitEmail(values.email);
      setIsSubmitted(true);
      
      // Display success message
      toast.success("تم إرسال بريد استرجاع كلمة المرور بنجاح");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      toast.error("حدث خطأ أثناء إرسال البريد. الرجاء المحاولة مرة أخرى.");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset form state when dialog is closed
    setTimeout(() => {
      form.reset();
      setIsSubmitted(false);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="rtl:text-right ltr:text-left sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">استرجاع كلمة المرور</DialogTitle>
          <DialogDescription>
            {!isSubmitted
              ? "أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطًا لإعادة تعيين كلمة المرور."
              : "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني."}
          </DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل بريدك الإلكتروني" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Alert variant="default" className="bg-primary/10 text-primary border-primary/20">
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  سيتم إرسال بريد إلكتروني يحتوي على رابط لإعادة تعيين كلمة المرور.
                </AlertDescription>
              </Alert>

              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-reverse sm:space-x-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                >
                  إلغاء
                </Button>
                <Button 
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                تم إرسال بريد إلكتروني مع تعليمات إعادة تعيين كلمة المرور إلى <strong className="font-semibold">{submitEmail}</strong>
              </AlertDescription>
            </Alert>
            
            <p className="text-sm text-muted-foreground">
              يرجى فحص بريدك الإلكتروني، بما في ذلك مجلد البريد العشوائي، للعثور على رسالتنا.
              الرابط صالح لمدة 24 ساعة فقط.
            </p>
            
            <div className="mt-4">
              <Button
                variant="outline"
                type="button"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleClose}
              >
                <ArrowLeft className="h-4 w-4" />
                العودة لصفحة تسجيل الدخول
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
