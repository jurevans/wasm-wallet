import React, { ReactElement } from 'react';

interface Props<T = string | number> {
  selectedValue: T;
  options: {
    label: string;
    value: T;
  }[];
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function Select<T>({
  selectedValue,
  options = [],
  className = '',
  onChange,
}: Props<T>): ReactElement {
  return (
    <select
      onChange={onChange}
      className={className}
      value={`${selectedValue}`}
    >
      {options.map(({ label, value }, i) => (
        <option key={i} value={`${value}`}>
          {label}
        </option>
      ))}
    </select>
  );
}
