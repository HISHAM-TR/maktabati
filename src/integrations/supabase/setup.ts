
import { supabase } from './client';

/**
 * Helper function for Supabase setup. Not for production use.
 * This should be used only during development to initialize the database.
 */
export const setupSupabaseDb = async () => {
  console.log('Setting up Supabase database...');
  
  try {
    // Create the profiles table if it doesn't exist
    const { error: profilesError } = await supabase.rpc('create_profiles_if_not_exists');
    if (profilesError) {
      console.error('Error creating profiles table:', profilesError);
    }
    
    // Create user_roles table if it doesn't exist
    const { error: rolesError } = await supabase.rpc('create_user_roles_if_not_exists');
    if (rolesError) {
      console.error('Error creating user_roles table:', rolesError);
    }
    
    // Create libraries table if it doesn't exist
    const { error: librariesError } = await supabase.rpc('create_libraries_if_not_exists');
    if (librariesError) {
      console.error('Error creating libraries table:', librariesError);
    }
    
    // Create books table if it doesn't exist
    const { error: booksError } = await supabase.rpc('create_books_if_not_exists');
    if (booksError) {
      console.error('Error creating books table:', booksError);
    }
    
    // Create site_settings table if it doesn't exist
    const { error: settingsError } = await supabase.rpc('create_site_settings_if_not_exists');
    if (settingsError) {
      console.error('Error creating site_settings table:', settingsError);
    }
    
    // Create social_links table if it doesn't exist
    const { error: linksError } = await supabase.rpc('create_social_links_if_not_exists');
    if (linksError) {
      console.error('Error creating social_links table:', linksError);
    }
    
    // Create tickets and ticket_responses tables if they don't exist
    const { error: ticketsError } = await supabase.rpc('create_tickets_if_not_exists');
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
