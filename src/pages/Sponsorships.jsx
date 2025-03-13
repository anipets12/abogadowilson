import React from 'react';

const Sponsorships = () => {
  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <h1 className='text-3xl font-bold mb-8'>Patrocinios y Promociones</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>Patrocinio Básico</h2>
          <p className='text-gray-700 mb-4'>Desde $500</p>
          <ul className='list-disc list-inside text-gray-700'>
            <li>Mención en redes sociales</li>
            <li>Logo en página web</li>
          </ul>
          <button className='mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>Más información</button>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>Patrocinio Premium</h2>
          <p className='text-gray-700 mb-4'>Desde $1000</p>
          <ul className='list-disc list-inside text-gray-700'>
            <li>Mención en redes sociales</li>
            <li>Logo en página web</li>
            <li>Artículo en blog</li>
          </ul>
          <button className='mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>Más información</button>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>Patrocinio VIP</h2>
          <p className='text-gray-700 mb-4'>Desde $2000</p>
          <ul className='list-disc list-inside text-gray-700'>
            <li>Mención en redes sociales</li>
            <li>Logo en página web</li>
            <li>Artículo en blog</li>
            <li>Entrevista exclusiva</li>
          </ul>
          <button className='mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>Más información</button>
        </div>
      </div>
    </div>
  );
};

export default Sponsorships;
