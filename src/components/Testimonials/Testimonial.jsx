import React from 'react';

const Testimonial = ({ name, comment, image }) => {
  return (
    <div className="testimonial">
      <img src={image} alt={name} />
      <h4>{name}</h4>
      <p>{comment}</p>
    </div>
  );
};

export default Testimonial;
