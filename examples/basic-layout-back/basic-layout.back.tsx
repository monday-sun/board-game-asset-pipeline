import React from 'react';

interface CardBackProps {
  backImageUrl: string;
}

const CardBack: React.FC<CardBackProps> = ({ backImageUrl }) => {
  return (
    <div style={{ border: '1px solid #000', width: '200px', padding: '10px' }}>
      <img src={backImageUrl} alt="Card back" style={{ width: '100%' }} />
    </div>
  );
};

export default CardBack;
