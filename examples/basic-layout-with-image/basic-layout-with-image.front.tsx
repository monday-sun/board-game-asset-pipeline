import React from 'react';

interface CardProps {
  name: string;
  imageUrl: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ name, imageUrl, description }) => {
  return (
    <body
      style={{
        border: '1px solid #000',
        width: '200px',
        height: '350px',
        padding: '10px',
      }}
    >
      <h2>{name}</h2>
      <img
        src={`${imageUrl}`}
        alt={name}
        style={{ width: '100%', height: '50%' }}
      />
      <p>{`${imageUrl}`}</p>
      <p>{description}</p>
    </body>
  );
};

export default Card;
