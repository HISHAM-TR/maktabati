
import React from "react";
import { User, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CreateUserFormValues } from "@/components/admin/types";

const createUserSchema = z.object({
  name: z.string().min(2, { message: "الاسم يجب أن يحتوي على حرفين على الأقل" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
  role: z.enum(["owner", "admin", "moderator", "user"], {
    required_error: "يرجى اختيار دور المستخدم",
  }),
});

type FormValues = z.infer<typeof createUserSchema>;

interface CreateUserDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleCreateUser: (values: CreateUserFormValues) => void;
}

const CreateUserDialog = ({
  isOpen,
  setIsOpen,
  handleCreateUser,
}: CreateUserDialogProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  const onSubmit = (values: FormValues) => {
    // Make sure all required fields are present
    const formData: CreateUserFormValues = {
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role
    };
    handleCreateUser(formData);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) form.reset();
      }}
    >
      <DialogContent className="rtl:text-right ltr:text-left">
        <DialogHeader>
          <DialogTitle>إضافة مستخدم جديد</DialogTitle>
          <DialogDescription>
            أدخل بيانات المستخدم الجديد. جميع الحقول مطلوبة.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم المستخدم" dir="rtl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="user@example.com" 
                      dir="ltr" 
                      className="text-right" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="******" 
                      dir="ltr" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    كلمة المرور يجب أن تتكون من 6 أحرف على الأقل
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>دور المستخدم</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-reverse space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="user" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer flex items-center gap-2">
                          <User className="h-4 w-4" />
                          مستخدم عادي
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-reverse space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="moderator" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          مشرف محدود
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-reverse space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="admin" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          مشرف
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-reverse space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="owner" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          مالك النظام
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="flex-row-reverse sm:justify-start">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit">إنشاء المستخدم</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
