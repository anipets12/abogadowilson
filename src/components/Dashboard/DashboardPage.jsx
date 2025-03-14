import React from 'react';
import ClientDashboard from './ClientDashboard';
import CommentForm from '../Comments/CommentForm';
import CommentList from '../Comments/CommentList';
import AffiliateRegister from '../Affiliates/AffiliateRegister';
import AffiliateList from '../Affiliates/AffiliateList';
import TokenSystem from '../Tokens/TokenSystem';

const DashboardPage = () => {
  return (
    <div className="space-y-8 p-8">
      <ClientDashboard />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Comentarios</h2>
          <CommentForm postId={1} />
          <CommentList postId={1} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Afiliados</h2>
          <AffiliateRegister />
          <AffiliateList />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Consultas</h2>
        <TokenSystem />
      </div>
    </div>
  );
};

export default DashboardPage;
