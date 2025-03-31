
import { supabase } from './client';
import { toast } from 'sonner';

/**
 * Helper function for Supabase setup. Not for production use.
 * This should be used only during development to initialize the database.
 */
export const setupSupabaseDb = async () => {
  console.log('Setting up Supabase database...');
  
  try {
    // Invoke the edge function to set up database tables
    const { data: tablesData, error: tablesError } = await supabase.functions.invoke('setup-db-tables', {
      body: {}
    });
    
    if (tablesError) {
      console.error('Error setting up database tables:', tablesError);
      return false;
    }
    
    console.log('Database tables setup response:', tablesData);
    
    // Create default owner account if needed
    try {
      const { data: ownerData, error: ownerError } = await supabase.functions.invoke('create-owner-account', {
        body: {}
      });
      
      if (ownerError) {
        console.error('Error creating owner account:', ownerError);
      } else {
        console.log('Owner account setup response:', ownerData);
        if (!ownerData.exists) {
          toast.success('تم إنشاء حساب المالك بنجاح. البريد الإلكتروني: admin@admin.com، كلمة المرور: 123456');
        }
      }
    } catch (ownerSetupError) {
      console.error('Exception during owner setup:', ownerSetupError);
    }
    
    console.log('Supabase database setup completed.');
    return true;
  } catch (error) {
    console.error('Error setting up Supabase database:', error);
    return false;
  }
};
