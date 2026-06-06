interface IdentityPickerProps {
  value: 'Me' | 'Wife' | null
  onChange: (identity: 'Me' | 'Wife') => void
}

function buttonClass(isSelected: boolean): string {
  const base = 'rounded-md px-4 py-2 min-h-[44px] text-sm font-semibold'
  return isSelected
    ? `${base} bg-blue-600 text-white`
    : `${base} bg-white text-gray-700 border border-gray-300`
}

export function IdentityPicker({ value, onChange }: IdentityPickerProps) {
  return (
    <div className="mb-6 flex items-center gap-2">
      <span className="text-sm font-semibold text-gray-600">I am:</span>
      <button
        aria-label="Set identity to Me"
        aria-pressed={value === 'Me'}
        onClick={() => onChange('Me')}
        className={buttonClass(value === 'Me')}
      >
        Me
      </button>
      <button
        aria-label="Set identity to Wife"
        aria-pressed={value === 'Wife'}
        onClick={() => onChange('Wife')}
        className={buttonClass(value === 'Wife')}
      >
        Wife
      </button>
    </div>
  )
}
