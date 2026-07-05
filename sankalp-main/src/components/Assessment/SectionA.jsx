import { CheckItem } from './shared';
import { UTTARAKHAND_DISTRICTS, HARIDWAR_BLOCKS, FACILITY_LIST } from '../../data/dataStore';

export default function SectionA({ data = {}, onChange, t, user }) {
  const d = data;
  const update = (key, val) => onChange({ ...d, [key]: val });

  // Helper function to validate 10-digit mobile number
  const isValidMobile = (num) => {
    if (!num) return true; // Optional field
    const cleaned = num.toString().replace(/\s/g, '');
    return /^\d{10}$/.test(cleaned);
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">📋 {t('identification')}</h3>
      <p className="text-slate-500 text-sm mb-5">{t('sectionADesc')}</p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* Column 1 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('district')}</label>
          <select
            value={d.district || ''}
            onChange={(e) => update('district', e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          >
            <option value="">-- {t('selectDistrict')} --</option>
            {UTTARAKHAND_DISTRICTS.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('blockName')}</label>
          <select
            value={d.blockName || ''}
            onChange={(e) => update('blockName', e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          >
            <option value="">-- {t('selectBlock')} --</option>
            {HARIDWAR_BLOCKS.map(block => (
              <option key={block} value={block}>{block}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('facilityType')}</label>
          <div className="flex gap-4">
            {['public', 'private'].map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="facilityType"
                  value={type}
                  checked={d.facilityType === type}
                  onChange={() => update('facilityType', type)}
                />
                <span className="text-sm capitalize text-slate-700">{t(type)}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('facilityName')}</label>
          <select
            value={d.facilityName || ''}
            onChange={(e) => update('facilityName', e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          >
            <option value="">-- {t('selectFacility')} --</option>
            {FACILITY_LIST.map(facility => (
              <option key={facility.code} value={facility.name}>{facility.name}</option>
            ))}
            <option value="Others">{t('others')}</option>
          </select>
        </div>

        {/* Other Facility Name - shown only if Others is selected */}
        {d.facilityName === 'Others' && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('otherFacilityName')}</label>
            <input
              type="text"
              value={d.other_facility_name || ''}
              onChange={(e) => update('other_facility_name', e.target.value)}
              placeholder={t('specifyFacilityName')}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('dateOfAdmission')}</label>
          <input
            type="date"
            value={d.date_of_admission || ''}
            onChange={(e) => update('date_of_admission', e.target.value)}
            required
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('motherName')}</label>
          <input
            type="text"
            value={d.mother_name || ''}
            onChange={(e) => update('mother_name', e.target.value)}
            required
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('fatherName')}</label>
          <input
            type="text"
            value={d.father_name || ''}
            onChange={(e) => update('father_name', e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('motherMobileNumber')}</label>
          <input
            type="text"
            value={d.mother_mobile || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/\s/g, '');
              // Only update if it's valid or empty (allowing intermediate states)
              if (value === '' || /^\d{0,10}$/.test(value)) {
                update('mother_mobile', value);
              }
            }}
            placeholder="{t('enter10DigitMobile')}"
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
          {!d.mother_mobile && d.mother_mobile !== '' && !isValidMobile(d.mother_mobile) && (
            <p className="text-red-500 text-sm mt-1">{t('invalidMobileNumber')}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('alternativeMobileNumber')}</label>
          <input
            type="text"
            value={d.alternative_mobile || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/\s/g, '');
              if (value === '' || /^\d{0,10}$/.test(value)) {
                update('alternative_mobile', value);
              }
            }}
            placeholder="{t('enter10DigitMobile')}"
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
          {!d.alternative_mobile && d.alternative_mobile !== '' && !isValidMobile(d.alternative_mobile) && (
            <p className="text-red-500 text-sm mt-1">{t('invalidMobileNumber')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('verifiedMobileNumber')}</label>
          <div className="flex gap-4">
            {['motherNumber', 'alternativeNumber', 'other'].map(option => (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="verified_mobile"
                  value={option}
                  checked={d.verified_mobile === option}
                  onChange={() => update('verified_mobile', option)}
                />
                <span className="text-sm capitalize text-slate-700">{t(option)}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('contactVerificationStatus')}</label>
          <div className="flex gap-4">
            {['verified', 'not_verified'].map(status => (
              <label key={status} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="contact_verification_status"
                  value={status}
                  checked={d.contact_verification_status === status}
                  onChange={() => update('contact_verification_status', status)}
                />
                <span className="text-sm capitalize text-slate-700">{t(status)}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('village')}</label>
          <input
            type="text"
            value={d.village || ''}
            onChange={(e) => update('village', e.target.value)}
            required
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('ruralUrban')}</label>
          <div className="flex gap-4">
            {['rural', 'urban'].map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rural_urban"
                  value={type}
                  checked={d.rural_urban === type}
                  onChange={() => update('rural_urban', type)}
                />
                <span className="text-sm capitalize text-slate-700">{t(type)}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('ashaName')}</label>
          <input
            type="text"
            value={d.asha_name || ''}
            onChange={(e) => update('asha_name', e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('ashaMobileNumber')}</label>
          <input
            type="text"
            value={d.asha_mobile || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/\s/g, '');
              if (value === '' || /^\d{0,10}$/.test(value)) {
                update('asha_mobile', value);
              }
            }}
            placeholder="{t('enter10DigitMobile')}"
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
          {!d.asha_mobile && d.asha_mobile !== '' && !isValidMobile(d.asha_mobile) && (
            <p className="text-red-500 text-sm mt-1">{t('invalidMobileNumber')}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('anmName')}</label>
          <input
            type="text"
            value={d.anm_name || ''}
            onChange={(e) => update('anm_name', e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('anmMobileNumber')}</label>
          <input
            type="text"
            value={d.anm_mobile || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/\s/g, '');
              if (value === '' || /^\d{0,10}$/.test(value)) {
                update('anm_mobile', value);
              }
            }}
            placeholder="{t('enter10DigitMobile')}"
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
          {!d.anm_mobile && d.anm_mobile !== '' && !isValidMobile(d.anm_mobile) && (
            <p className="text-red-500 text-sm mt-1">{t('invalidMobileNumber')}</p>
          )}
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('assessorName')}</label>
        <input
          type="text"
          value={d.assessor_name || ''}
          onChange={(e) => update('assessor_name', e.target.value)}
          required
          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
        />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#0F4C75]/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#0F4C75]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">{t('counsellorName')}</p>
            <p className="text-sm font-semibold text-slate-800">{user?.name || t('notAssigned')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#0F4C75]/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#0F4C75]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">{t('supervisorName')}</p>
            <p className="text-sm font-semibold text-slate-800">{user?.name || t('notAssigned')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('motherAge')}</label>
          <input
            type="number"
            value={d.mother_age || ''}
            onChange={(e) => update('mother_age', e.target.value)}
            required
            placeholder="{t('enterAge')}"
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('gravida')}</label>
          <input
            type="number"
            value={d.gravida || ''}
            onChange={(e) => update('gravida', e.target.value)}
            required
            placeholder="{t('g1g2etc')}"
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('para')}</label>
          <input
            type="number"
            value={d.para || ''}
            onChange={(e) => update('para', e.target.value)}
            required
            placeholder="{t('p0p1etc')}"
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('lastMenstrualPeriod')}</label>
          <input
            type="date"
            value={d.lmp || ''}
            onChange={(e) => update('lmp', e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('wasMotherHRP')}</label>
        <div className="flex gap-4">
          {['yes', 'no'].map(option => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="isHRP"
                value={option}
                checked={d.isHRP === option}
                onChange={() => update('isHRP', option)}
              />
              <span className="text-sm capitalize text-slate-700">{t(option)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* HRP Type - shown only if HRP = Yes */}
      {d.isHRP === 'yes' && (
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('hrpType')}</label>
          <select
            value={d.hrp_type || ''}
            onChange={(e) => update('hrp_type', e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          >
            <option value="">-- {t('selectHRPType')} --</option>
            <option value="diabetes">{t('diabetes')}</option>
            <option value="hypertension">{t('hypertension')}</option>
            <option value="anemia">{t('anemia')}</option>
            <option value="previous_cesarean">{t('previousCesarean')}</option>
            <option value="multiple_pregnancy">{t('multiplePregnancy')}</option>
            <option value="other">{t('other')}</option>
          </select>
        </div>
      )}

      <div className="mb-5">
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('registrationRemarks')}</label>
        <textarea
          value={d.registration_remarks || ''}
          onChange={(e) => update('registration_remarks', e.target.value)}
          rows={3}
          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
        />
      </div>
    </div>
  );
}