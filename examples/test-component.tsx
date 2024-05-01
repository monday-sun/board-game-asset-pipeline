import React from 'react';

const TestComponent = ({ message }: { message: string }) => (
  <div style={{ color: 'blue' }}>Huh, {message}?</div>
);

export default TestComponent;
