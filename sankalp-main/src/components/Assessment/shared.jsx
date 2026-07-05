export function CheckItem({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between py-2 border-b border-slate-50 cursor-pointer">
      <span className="text-sm text-slate-700">{label}</span>
      <div className="flex gap-3">
        {['yes', 'no'].map(v => (
          <button key={v} type="button" onClick={() => onChange(v === 'yes')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
              (v === 'yes' && checked === true) || (v === 'no' && checked === false)
                ? v === 'yes' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-rose-100 text-rose-700 border-rose-300'
                : 'bg-white text-slate-400 border-slate-200'
            }`}>
            {v === 'yes' ? 'Yes' : 'No'}
          </button>
        ))}
      </div>
    </label>
  );
}

export function CorrectIncorrect({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between py-2 border-b border-slate-50 cursor-pointer">
      <span className="text-sm text-slate-700">{label}</span>
      <div className="flex gap-3">
        {['correct', 'incorrect'].map(v => (
          <button key={v} type="button" onClick={() => onChange(v)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
              value === v
                ? v === 'correct' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-rose-100 text-rose-700 border-rose-300'
                : 'bg-white text-slate-400 border-slate-200'
            }`}>
            {v === 'correct' ? 'Correct' : 'Incorrect'}
          </button>
        ))}
      </div>
    </label>
  );
}

export function SegmentButton({ options, value, onChange, t }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map(k => (
        <button key={k} type="button" onClick={() => onChange(k)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${value === k ? 'bg-[#0F4C75] text-white border-[#0F4C75]' : 'bg-white text-slate-500 border-slate-200'}`}>
          {t ? t(k) : k}
        </button>
      ))}
    </div>
  );
}
