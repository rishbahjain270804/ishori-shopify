import { useState } from 'react';
import PropTypes from 'prop-types';
import './DateRangePicker.css';

const DateRangePicker = ({ onDateRangeChange, defaultPeriod = 'month' }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(defaultPeriod);
  const [showCustom, setShowCustom] = useState(false);
  const [customDates, setCustomDates] = useState({
    from: '',
    to: ''
  });

  const periods = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    
    if (period === 'custom') {
      setShowCustom(true);
    } else {
      setShowCustom(false);
      onDateRangeChange({ period });
    }
  };

  const handleCustomDateChange = (field, value) => {
    const newDates = { ...customDates, [field]: value };
    setCustomDates(newDates);
    
    // Only trigger change if both dates are set
    if (newDates.from && newDates.to) {
      onDateRangeChange({
        from: newDates.from,
        to: newDates.to
      });
    }
  };

  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    return formatDateForInput(new Date());
  };

  return (
    <div className="date-range-picker">
      <div className="period-buttons">
        {periods.map((period) => (
          <button
            key={period.value}
            className={`period-btn ${selectedPeriod === period.value ? 'active' : ''}`}
            onClick={() => handlePeriodChange(period.value)}
          >
            {period.label}
          </button>
        ))}
      </div>
      
      {showCustom && (
        <div className="custom-date-inputs">
          <div className="date-input-group">
            <label htmlFor="from-date">From</label>
            <input
              id="from-date"
              type="date"
              value={customDates.from}
              max={customDates.to || getMaxDate()}
              onChange={(e) => handleCustomDateChange('from', e.target.value)}
              className="date-input"
            />
          </div>
          <div className="date-input-group">
            <label htmlFor="to-date">To</label>
            <input
              id="to-date"
              type="date"
              value={customDates.to}
              min={customDates.from}
              max={getMaxDate()}
              onChange={(e) => handleCustomDateChange('to', e.target.value)}
              className="date-input"
            />
          </div>
        </div>
      )}
    </div>
  );
};

DateRangePicker.propTypes = {
  onDateRangeChange: PropTypes.func.isRequired,
  defaultPeriod: PropTypes.oneOf(['today', 'week', 'month', 'year', 'custom'])
};

export default DateRangePicker;
