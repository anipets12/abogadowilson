import React from 'react';

const Certificates = () => {
  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <h1 className='text-3xl font-bold mb-8'>Certificados en Línea</h1>
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <h2 className='text-xl font-semibold mb-4'>Generar Certificado</h2>
        <form className='space-y-4'>
          <div>
            <label className='block text-gray-700'>Tipo de Certificado</label>
            <select className='mt-1 block w-full p-2 border border-gray-300 rounded-lg'>
              <option>Certificado de Trabajo</option>
              <option>Certificado de Estudios</option>
              <option>Certificado de Residencia</option>
            </select>
          </div>
          <div>
            <label className='block text-gray-700'>Detalles</label>
            <textarea className='mt-1 block w-full p-2 border border-gray-300 rounded-lg' rows='4'></textarea>
          </div>
          <button type='submit' className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>Generar Certificado</button>
        </form>
      </div>
    </div>
  );
};

export default Certificates;
