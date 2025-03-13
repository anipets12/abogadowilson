import React from 'react';

const Post = ({ title, content, image }) => {
  return (
    <div className="blog-post">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{content}</p>
      <button className="btn-primary">Leer Más</button>
    </div>
  );
};

export default Post;
