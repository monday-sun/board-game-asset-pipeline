import React from 'react';
import { localImageToUri } from '../local-image-to-uri';

interface CardBackProps {
  backImageUrl: string;
}

const CardBack: React.FC<CardBackProps> = ({ backImageUrl }) => {
  return (
    <body
      style={{
        border: '1px solid #000',
        width: '200px',
        height: '350px',
        padding: '10px',
      }}
    >
      <div
        style={{
          border: '1px solid #000',
          padding: '10px',
        }}
      >
        <img
          src={localImageToUri(backImageUrl)}
          alt="Card back"
          style={{ width: '100%' }}
        />
      </div>
    </body>
  );
};

export default CardBack;
