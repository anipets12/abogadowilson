import { prisma, supabase } from './config/database';

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    // Check if prisma is initialized
    if (!prisma) return false;
    // Simple query to check connection
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    // Check if supabase client is initialized
    if (!supabase) return false;
    // Simple query to check connection
    const { error } = await supabase.from('health_check').select('count').limit(1);
    return !error;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
}

export async function checkPayPalConnection(): Promise<boolean> {
  try {
    // Basic check - in a real app this would verify PayPal API access
    // Using a simple token validation check as a placeholder
    const paypalEnvVars = process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET;
    return !!paypalEnvVars;
  } catch (error) {
    console.error('PayPal connection error:', error);
    return false;
  }
}

export async function checkHealth() {
  try {
    const services = {
      database: await checkDatabaseConnection(),
      supabase: await checkSupabaseConnection(),
      paypal: await checkPayPalConnection()
    };

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services
    };
  } catch (error: any) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}
