
import { supabase } from './client';

/**
 * Helper function for Supabase setup. Not for production use.
 * This should be used only during development to initialize the database.
 */
export const setupSupabaseDb = async () => {
  console.log('Setting up Supabase database...');
  
  try {
    // Create the profiles table if it doesn't exist
    const { error: profilesError } = await supabase.functions.invoke('setup-db-tables', {
      body: { table: 'profiles' }
    });
    if (profilesError) {
      console.error('Error creating profiles table:', profilesError);
    }
    
    // Create user_roles table if it doesn't exist
    const { error: rolesError } = await supabase.functions.invoke('setup-db-tables', {
      body: { table: 'user_roles' }
    });
    if (rolesError) {
      console.error('Error creating user_roles table:', rolesError);
    }
    
    // Create libraries table if it doesn't exist
    const { error: librariesError } = await supabase.functions.invoke('setup-db-tables', {
      body: { table: 'libraries' }
    });
    if (librariesError) {
      console.error('Error creating libraries table:', librariesError);
    }
    
    // Create books table if it doesn't exist
    const { error: booksError } = await supabase.functions.invoke('setup-db-tables', {
      body: { table: 'books' }
    });
    if (booksError) {
      console.error('Error creating books table:', booksError);
    }
    
    // Create site_settings table if it doesn't exist
    const { error: settingsError } = await supabase.functions.invoke('setup-db-tables', {
      body: { table: 'site_settings' }
    });
    if (settingsError) {
      console.error('Error creating site_settings table:', settingsError);
    }
    
    // Create social_links table if it doesn't exist
    const { error: linksError } = await supabase.functions.invoke('setup-db-tables', {
      body: { table: 'social_links' }
    });
    if (linksError) {
      console.error('Error creating social_links table:', linksError);
    }
    
    // Create tickets and ticket_responses tables if they don't exist
    const { error: ticketsError } = await supabase.functions.invoke('setup-db-tables', {
      body: { table: 'tickets' }
    });
    if (ticketsError) {
      console.error('Error creating tickets table:', ticketsError);
    }
    
    console.log('Supabase database setup completed.');
    return true;
  } catch (error) {
    console.error('Error setting up Supabase database:', error);
    return false;
  }
};
