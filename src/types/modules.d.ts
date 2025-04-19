/**
 * Declaraciones de mu00f3dulos para resolver errores de importaciu00f3n
 */

// Declaraciu00f3n para rutas
declare module './routes' {
  const Routes: React.FC;
  export default Routes;
}

// Rutas especu00edficas
declare module './routes/dashboard' {
  export const dashboardRouter: any;
}

declare module './routes/consultation' {
  export const consultationRouter: any;
}

declare module './routes/payment' {
  export const paymentRouter: any;
}

declare module './routes/appointments' {
  export const appointmentsRouter: any;
}

// Servicios de PayPal
declare module './lib/paypal' {
  export const paypalClient: any;
  export function createOrder(amount: number, currency: string, reference: string): Promise<any>;
  export function capturePayment(orderId: string): Promise<any>;
}

// Mu00f3dulos de terceros que no tienen declaraciones de tipos
declare module '@paypal/checkout-server-sdk' {
  const core: any;
  export default any;
}

declare module '@notionhq/client' {
  export class Client {
    constructor(options: { auth: string });
    databases: {
      query(params: any): Promise<any>;
      create(params: any): Promise<any>;
    };
    pages: {
      create(params: any): Promise<any>;
      update(params: any): Promise<any>;
    };
  }
}

// Declaraciones para Cloudflare Workers
declare module '@cloudflare/workers-types' {
  export interface KVNamespace {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
  }
}

declare module '__STATIC_CONTENT_MANIFEST' {
  const manifest: string;
  export default manifest;
}

// Cloudflare KV asset handler
declare module '@cloudflare/kv-asset-handler' {
  export function getAssetFromKV(request: Request, options?: any): Promise<Response>;
}
