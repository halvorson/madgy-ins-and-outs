interface IdentityPickerProps {
  value: 'Me' | 'Wife'
  onChange: (identity: 'Me' | 'Wife') => void
}

export function IdentityPicker({ value, onChange }: IdentityPickerProps) {
  return (
    <div className="flex rounded-full border border-gray-300 overflow-hidden text-sm font-semibold">
      <button
        aria-label="Set identity to Me"
        aria-pressed={value === 'Me'}
        onClick={() => onChange('Me')}
        className={`px-4 py-1.5 transition-colors${value === 'Me' ? ' bg-blue-600 text-white' : ' bg-white text-gray-600'}`}
      >
        Me
      </button>
      <button
        aria-label="Set identity to Wife"
        aria-pressed={value === 'Wife'}
        onClick={() => onChange('Wife')}
        className={`px-4 py-1.5 transition-colors${value === 'Wife' ? ' bg-blue-600 text-white' : ' bg-white text-gray-600'}`}
      >
        Wife
      </button>
    </div>
  )
}
