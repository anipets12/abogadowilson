import React from 'react';

const Recommendation = ({ title, description, link }) => {
  return (
    <div className="recommendation">
      <h3>{title}</h3>
      <p>{description}</p>
      <a href={link} className="btn-primary">Ver Más</a>
    </div>
  );
};

export default Recommendation;
