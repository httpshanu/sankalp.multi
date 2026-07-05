import { CheckItem } from './shared';

export default function SectionF({ data = {}, onChange, t }) {
  const d = data;
  const update = (key, val) => onChange({ ...d, [key]: val });

  const directMilkOptions = ['1hour', '2hour', '3hour', '4hour', 'over5hour'];
  const expressOptions = ['within6Hours', 'within12Hours', 'over12Hours'];
  const kmcOptions = ['1hour', '2hour', '3hour', '4hour', 'over5hour', 'never'];
  const feedMethods = ['directBF', 'cup', 'spoon', 'tube', 'expressedMilk'];

  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">🏥 {t('sickBaby')}</h3>
      <p className="text-slate-500 text-sm mb-5">{t('sickBabyDesc')}</p>

      <CheckItem label={t('applicable')} checked={d.sickBabyApplicable} onChange={v => update('sickBabyApplicable', v)} />

      {d.sickBabyApplicable && (
        <div className="mt-4">
          <h4 className="font-semibold text-slate-700 mb-2">{t('directMotherMilkStarted')}</h4>
          <div className="flex gap-2 mb-4 flex-wrap">
            {directMilkOptions.map(k => (
              <button key={k} type="button" onClick={() => update('directMilkTiming', k)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${d.directMilkTiming === k ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-white text-slate-500 border-slate-200'}`}>
                {t(k)}
              </button>
            ))}
          </div>

          <h4 className="font-semibold text-slate-700 mb-2">{t('motherExpressingMilk')}</h4>
          <div className="flex gap-2 mb-4 flex-wrap">
            {expressOptions.map(k => (
              <button key={k} type="button" onClick={() => update('expressTiming', k)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${d.expressTiming === k ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-white text-slate-500 border-slate-200'}`}>
                {t(k)}
              </button>
            ))}
          </div>

          <h4 className="font-semibold text-slate-700 mb-2">{t('kmcStarted')}</h4>
          <div className="flex gap-2 mb-4 flex-wrap">
            {kmcOptions.map(k => (
              <button key={k} type="button" onClick={() => update('kmcTiming', k)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${d.kmcTiming === k ? 'bg-teal-100 text-teal-700 border-teal-300' : 'bg-white text-slate-500 border-slate-200'}`}>
                {t(k)}
              </button>
            ))}
          </div>

          <h4 className="font-semibold text-slate-700 mb-2">{t('feedingMethod')}</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {feedMethods.map(k => (
              <button key={k} type="button" onClick={() => update('feedingMethod', k)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${d.feedingMethod === k ? 'bg-teal-100 text-teal-700 border-teal-300' : 'bg-white text-slate-500 border-slate-200'}`}>
                {t(k)}
              </button>
            ))}
          </div>

          <CheckItem label={t('counselledDaily')} checked={d.counselledDaily} onChange={v => update('counselledDaily', v)} />
        </div>
      )}
    </div>
  );
}
