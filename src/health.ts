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
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}
