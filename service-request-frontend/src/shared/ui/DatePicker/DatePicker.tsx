import styles from './DatePicker.module.css';

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: string;
  max?: string;
}

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = 'Выберите дату',
  min,
  max,
}: DatePickerProps) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type="date"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
      />
    </div>
  );
}

interface DateRangePickerProps {
  fromValue: string;
  toValue: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  fromLabel?: string;
  toLabel?: string;
}

export function DateRangePicker({
  fromValue,
  toValue,
  onFromChange,
  onToChange,
  fromLabel = 'От',
  toLabel = 'До',
}: DateRangePickerProps) {
  return (
    <div className={styles.rangeWrapper}>
      <DatePicker
        label={fromLabel}
        value={fromValue}
        onChange={onFromChange}
        max={toValue || undefined}
      />
      <span className={styles.rangeSeparator}>—</span>
      <DatePicker
        label={toLabel}
        value={toValue}
        onChange={onToChange}
        min={fromValue || undefined}
      />
    </div>
  );
}

