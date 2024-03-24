import React from 'react';

interface DropdownProps {
  options: (string | { option_text: string } | { label: string, value: string })[] | { [key: string]: { option_text: string } };
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  className?: string;
  defaultValue?: string;
  label: string;
  showSelected: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  handleChange,
  disabled = false,
  className = '',
  defaultValue = '',
  label,
  showSelected
}) => {
  const renderOptions = () => {
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
        <option key={index} value={options[key].option_text}>{options[key].option_text}</option>
      ));
    }
  };

  return (
    <div className={`dropdown ${className}`} >
      {label}: {showSelected && <span>{defaultValue}</span>}
      <select
        defaultValue={defaultValue}
        onChange={handleChange}
        disabled={disabled}
        className="select select-bordered w-full max-w-xs"
      >
        {renderOptions()}
      </select>
    </div>
  );
};

export default Dropdown;