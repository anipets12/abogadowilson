import React, { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BankTransfer = ({ amount }) => {
  const bankAccount = '2203728320'; // Número de cuenta de Pichincha actualizado
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    // Aquí se podría implementar un envío de notificación al administrador
    navigate('/gracias', { 
      state: { 
        paymentMethod: 'bank',
        amount: amount,
        status: 'pending'
      } 
    });
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Datos para Transferencia Bancaria</h3>
      <div className="space-y-3 text-gray-700">
        <div className="flex justify-between items-center">
          <p><span className="font-medium">Banco:</span> Banco del Pichincha</p>
          <button 
            onClick={() => handleCopy('Banco del Pichincha')}
            className="text-blue-500 hover:text-blue-700"
          >
            {copied ? <FaCheck /> : <FaCopy />}
          </button>
        </div>
        <div className="flex justify-between items-center">
          <p><span className="font-medium">Tipo de Cuenta:</span> Corriente</p>
          <button 
            onClick={() => handleCopy('Corriente')}
            className="text-blue-500 hover:text-blue-700"
          >
            {copied ? <FaCheck /> : <FaCopy />}
          </button>
        </div>
        <div className="flex justify-between items-center">
          <p><span className="font-medium">Número de Cuenta:</span> {bankAccount}</p>
          <button 
            onClick={() => handleCopy(bankAccount)}
            className="text-blue-500 hover:text-blue-700"
          >
            {copied ? <FaCheck /> : <FaCopy />}
          </button>
        </div>
        <div className="flex justify-between items-center">
          <p><span className="font-medium">Beneficiario:</span> Wilson Alexander Ipiales Guerron</p>
          <button 
            onClick={() => handleCopy('Wilson Alexander Ipiales Guerron')}
            className="text-blue-500 hover:text-blue-700"
          >
            {copied ? <FaCheck /> : <FaCopy />}
          </button>
        </div>
        <div className="flex justify-between items-center">
          <p><span className="font-medium">Email:</span> alexip2@hotmail.com</p>
          <button 
            onClick={() => handleCopy('alexip2@hotmail.com')}
            className="text-blue-500 hover:text-blue-700"
          >
            {copied ? <FaCheck /> : <FaCopy />}
          </button>
        </div>
        <div className="flex justify-between items-center">
          <p><span className="font-medium">Monto a Transferir:</span> ${amount}</p>
          <button 
            onClick={() => handleCopy(`$${amount}`)}
            className="text-blue-500 hover:text-blue-700"
          >
            {copied ? <FaCheck /> : <FaCopy />}
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-yellow-700 text-sm">
          Importante: Después de realizar la transferencia, por favor envíe el comprobante al WhatsApp +593 988835269 o al correo alexip2@hotmail.com para confirmar su pago.
        </p>
      </div>

      <button
        onClick={handleConfirm}
        className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
      >
        He realizado la transferencia
      </button>
    </div>
  );
};

export default BankTransfer;
