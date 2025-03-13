import React from 'react';

const BankTransfer = ({ amount }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Datos para Transferencia Bancaria</h3>
      <div className="space-y-3 text-gray-700">
        <p><span className="font-medium">Banco:</span> Banco del Pichincha</p>
        <p><span className="font-medium">Tipo de Cuenta:</span> Corriente</p>
        <p><span className="font-medium">Número de Cuenta:</span> 1234567890</p>
        <p><span className="font-medium">Beneficiario:</span> Wilson Ipiales</p>
        <p><span className="font-medium">RUC:</span> 1234567890123</p>
        <p><span className="font-medium">Monto a Transferir:</span> ${amount}</p>
      </div>
    </div>
  );
};

export default BankTransfer;
