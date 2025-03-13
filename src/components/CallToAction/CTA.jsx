import React from 'react';

const CTA = ({ title, description, buttonText, link }) => {
  return (
    <div className="cta">
      <h2>{title}</h2>
      <p>{description}</p>
      <a href={link} className="btn-primary">{buttonText}</a>
    </div>
  );
};

export default CTA;
