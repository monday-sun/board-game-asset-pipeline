import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Card from './basic-layout-with-image.front';

describe('Card', () => {
  it('renders the card with a title, image, and description', () => {
    render(
      <Card
        name="Test Card"
        imageUrl="test.jpg"
        description="This is a test card."
      />,
    );

    expect(screen.getByRole('heading')).toHaveTextContent('Test Card');
    expect(screen.getByRole('img')).toHaveAttribute('src', 'test.jpg');
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Test Card');
    expect(screen.getByText('This is a test card.')).toBeInTheDocument();
  });
});
