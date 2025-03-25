import { describe, it, expect } from 'vitest';
import { routes } from '../routes';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

describe('Route Tests', () => {
  it('should verify all routes are accessible', async () => {
    const mainRoutes = [
      '/',
      '/servicios',
      '/consulta',
      '/documentos',
      '/perfil'
    ];

    for (const route of mainRoutes) {
      const response = await fetch(`http://localhost:8788${route}`);
      expect(response.status).not.toBe(404);
    }
  });

  it('should protect authenticated routes', async () => {
    const protectedRoutes = [
      '/perfil',
      '/documentos/crear',
      '/consulta/nueva'
    ];

    for (const route of protectedRoutes) {
      const response = await fetch(`http://localhost:8788${route}`);
      expect(response.status).toBe(401);
    }
  });
});
