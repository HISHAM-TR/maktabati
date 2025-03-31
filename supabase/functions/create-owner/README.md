
# وظيفة إنشاء مستخدم مالك

هذه وظيفة تسمح بإنشاء مستخدم وتعيينه كمالك للنظام. يتطلب البريد الإلكتروني وكلمة المرور والاسم. 

## المدخلات المطلوبة:
- `email`: البريد الإلكتروني للمستخدم
- `password`: كلمة المرور
- `name`: اسم المستخدم

## الاستخدام
```ts
const { data, error } = await supabase.functions.invoke('create-owner', {
  body: { email, password, name }
});

if (error) {
  console.error('Error creating owner account:', error);
} else {
  console.log('Owner account created successfully:', data);
}
```
