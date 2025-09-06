// client/src/components/ColorPicker.tsx

import React from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  const colors = ['yellow', 'blue', 'green', 'pink', 'orange'];

  return (
    <div>
      <label>Color: </label>
      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: color,
              border: value === color ? '2px solid #000' : '1px solid #ccc',
              cursor: 'pointer',
            }}
            aria-label={`Select ${color} color`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;