import React, { useCallback } from 'react';

interface DropdownProps {
  options: (string | { option_text: string } | { label: string, value: string })[] | { [key: string]: { option_text: string } };
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  className?: string;
  label: string;
  showSelected: boolean;
  value: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  handleChange,
  disabled = false,
  className = '',
  label,
  showSelected,
  value
}) => {
  const renderOptions = useCallback(() => {
    if (Array.isArray(options)) {
      return options.map((option, index) => {
        if (typeof option === 'string') {
          return <option key={index} value={option}>{option}</option>;
        } else if ('option_text' in option) {
          return <option key={index} value={option.option_text}>{option.option_text}</option>;
        } else {
          return <option key={index} value={option.value}>{option.label}</option>;
        }
      });
    } else {
      return Object.keys(options).map((key, index) => (
        <option key={index + 1} value={options[key].option_text}>{options[key].option_text}</option>
      ));
    }
  },[options])

  return (
    <div className={`dropdown ${className}`} >
      {label}: {showSelected && <span>{value}</span>}
      <select
        onChange={handleChange}
        disabled={disabled}
        value={value}
        className="select select-bordered w-full max-w-xs"
      >
        <option key={0} value={""}>{"None"}</option>
        {renderOptions()}
      </select>
    </div>
  );
};

export default Dropdown;