export const config = {
  development: {
    apiUrl: 'http://localhost:8080',
    wsUrl: 'ws://localhost:8080',
  },
  production: {
    apiUrl: 'https://api.abogadowilson.com',
    wsUrl: 'wss://api.abogadowilson.com',
  }
};

export const isDev = process.env.NODE_ENV === 'development';
export const baseUrl = isDev ? config.development.apiUrl : config.production.apiUrl;
