import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import styles from './FormField.module.css';

interface FieldWrapperProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  hint?: string;
}

function FieldWrapper({ label, htmlFor, children, hint }: FieldWrapperProps) {
  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={htmlFor} className={styles.label}>
          {label}
        </label>
      )}
      {children}
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string };
export function TextField({ label, hint, id, ...rest }: TextFieldProps) {
  const fieldId = id ?? `field-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <FieldWrapper label={label} htmlFor={fieldId} hint={hint}>
      <input id={fieldId} className={styles.input} {...rest} />
    </FieldWrapper>
  );
}

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string };
export function TextAreaField({ label, hint, id, ...rest }: TextAreaFieldProps) {
  const fieldId = id ?? `field-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <FieldWrapper label={label} htmlFor={fieldId} hint={hint}>
      <textarea id={fieldId} className={styles.textarea} rows={4} {...rest} />
    </FieldWrapper>
  );
}

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  options: { value: string; label: string }[];
};
export function SelectField({ label, hint, id, options, ...rest }: SelectFieldProps) {
  const fieldId = id ?? `field-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <FieldWrapper label={label} htmlFor={fieldId} hint={hint}>
      <select id={fieldId} className={styles.select} {...rest}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
