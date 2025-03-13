import React from 'react';

const Dashboard = () => {
  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <h1 className='text-3xl font-bold mb-8'>Mi Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>Mis Créditos</h2>
          <p className='text-gray-700'>Saldo disponible: $500</p>
          <button onClick={() => window.location.href='/credits'} className='mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>Ver detalles</button>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>Mis Productos</h2>
          <p className='text-gray-700'>No tienes productos activos</p>
          <button onClick={() => window.location.href='/products'} className='mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>Ver productos</button>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>Mis Consultas</h2>
          <p className='text-gray-700'>No tienes consultas pendientes</p>
          <button onClick={() => window.location.href='/queries'} className='mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>Ver consultas</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
