import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CardBack from './basic-layout.back';

describe('CardBack', () => {
  it('renders the card back with an image', () => {
    render(<CardBack backImageUrl="back.jpg" />);

    expect(screen.getByRole('img')).toHaveAttribute('src', 'back.jpg');
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Card back');
  });
});