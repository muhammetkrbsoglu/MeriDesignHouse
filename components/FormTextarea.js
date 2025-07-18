"use client"

export default function FormTextarea({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  helperText,
  rows = 3,
  className = "",
  ...props
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`
          w-full px-3 py-2 border rounded-lg text-sm resize-vertical
          focus:ring-2 focus:ring-pink-500 focus:border-pink-500
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300"}
        `}
        {...props}
      />
      {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
