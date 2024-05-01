import React from 'react';
//import './test-component.css'; // Assuming your CSS is in App.css

interface ColorBoxProps {
  color: string;
}

const ColorBox: React.FC<ColorBoxProps> = ({ color }) => {
  return <div className={`color-box ${color}`}>{color}</div>;
};

interface FeatureRowProps {
  color: string;
  count: number;
}

const FeatureRow: React.FC<FeatureRowProps> = ({ color, count }) => {
  return (
    <td>
      {Array.from({ length: count }).map((_, index) => (
        <ColorBox key={index} color={color} />
      ))}
    </td>
  );
};

const FeatureCard: React.FC<{
  name: string;
  bonus: string;
  development: number;
  test: number;
  architecture: number;
  design: number;
}> = ({ name, bonus, development, test, architecture, design }) => {
  const rows = [
    { id: 1, color: 'yellow', count: development },
    { id: 2, color: 'green', count: test },
    { id: 3, color: 'red', count: architecture },
    { id: 4, color: 'blue', count: design },
  ];

  return (
    <div className="feature-card">
      <div className="feature-header">
        <h2>{name}</h2>
        <div></div>
      </div>
      <table>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <FeatureRow color={row.color} count={row.count} />
            </tr>
          ))}
        </tbody>
      </table>
      <p>{bonus}</p>
    </div>
  );
};

export default FeatureCard;
