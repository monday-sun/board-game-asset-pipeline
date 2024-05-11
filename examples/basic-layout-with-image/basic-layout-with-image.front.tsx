import React from 'react';
import { localImageToUri } from '../local-image-to-uri';

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
        backgroundColor: 'green',
      }}
    >
      <h2>{name}</h2>
      <img
        src={`${localImageToUri(imageUrl)}`}
        alt={name}
        style={{ width: '100%', height: '50%' }}
      />
      <p>{description}</p>
    </body>
  );
};

export default Card;
