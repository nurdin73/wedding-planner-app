import React, { useState } from 'react';
import { HeartHandshake, Calendar } from 'lucide-react';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';
import { onboardingFormSchema } from '../../schemas/wedding-forms.schema';
import { MaskedCurrencyInput } from '../ui/masked-currency-input';
import { unmaskCurrency } from '../../utils/mask.utils';

export const OnboardingModal: React.FC = () => {
  const { state, initializePlanner } = useWeddingPlanner();
  const { profile } = state;

  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [budgetStr, setBudgetStr] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (profile.isInitialized) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numericBudget = unmaskCurrency(budgetStr);
    const result = onboardingFormSchema.safeParse({
      brideName,
      groomName,
      weddingDate,
      targetBudget: numericBudget,
      guestCountTarget: 0,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    initializePlanner({
      brideName: result.data.brideName,
      groomName: result.data.groomName,
      weddingDate: result.data.weddingDate,
      targetBudget: result.data.targetBudget,
      guestCountTarget: result.data.guestCountTarget,
    });
  };

  return (
    <div
      data-testid="onboarding-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A302C]/40 backdrop-blur-sm animate-fade-in"
    >
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 border border-[#ECE5DE] shadow-ambient">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#FDF0EE] flex items-center justify-center border border-[#F2DFDC] mb-3">
            <HeartHandshake className="w-6 h-6 text-[#B86B70]" strokeWidth={1.75} />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[#3A302C] tracking-tight">
            Janji Suci
          </h2>
          <p className="text-xs text-[#73635C] mt-1 max-w-[240px] leading-relaxed">
            Mulailah merangkai hari bahagia Anda dalam ruang digital yang tenang dan teratur.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[#73635C] mb-1">
                Mempelai Wanita
              </label>
              <input
                data-testid="input-bride-name"
                type="text"
                placeholder="cth: Sarah"
                value={brideName}
                onChange={(e) => {
                  setBrideName(e.target.value);
                  if (errors.brideName) setErrors((prev) => ({ ...prev, brideName: '' }));
                }}
                className={`w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border text-[#3A302C] placeholder-[#A89B95] focus:outline-none ${
                  errors.brideName ? 'border-rose-400 focus:border-rose-500' : 'border-[#ECE5DE] focus:border-[#B86B70]'
                }`}
              />
              {errors.brideName && (
                <p data-testid="error-bride-name" className="text-[10px] text-rose-600 mt-1">
                  {errors.brideName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#73635C] mb-1">
                Mempelai Pria
              </label>
              <input
                data-testid="input-groom-name"
                type="text"
                placeholder="cth: Dimas"
                value={groomName}
                onChange={(e) => {
                  setGroomName(e.target.value);
                  if (errors.groomName) setErrors((prev) => ({ ...prev, groomName: '' }));
                }}
                className={`w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border text-[#3A302C] placeholder-[#A89B95] focus:outline-none ${
                  errors.groomName ? 'border-rose-400 focus:border-rose-500' : 'border-[#ECE5DE] focus:border-[#B86B70]'
                }`}
              />
              {errors.groomName && (
                <p data-testid="error-groom-name" className="text-[10px] text-rose-600 mt-1">
                  {errors.groomName}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Tanggal Pernikahan
            </label>
            <div className="relative">
              <input
                data-testid="input-wedding-date"
                type="date"
                value={weddingDate}
                onChange={(e) => {
                  setWeddingDate(e.target.value);
                  if (errors.weddingDate) setErrors((prev) => ({ ...prev, weddingDate: '' }));
                }}
                className={`w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border text-[#3A302C] focus:outline-none ${
                  errors.weddingDate ? 'border-rose-400 focus:border-rose-500' : 'border-[#ECE5DE] focus:border-[#B86B70]'
                }`}
              />
              <Calendar className="w-4 h-4 text-[#A89B95] absolute right-3 top-2.5 pointer-events-none" strokeWidth={1.75} />
            </div>
            {errors.weddingDate && (
              <p data-testid="error-wedding-date" className="text-[10px] text-rose-600 mt-1">
                {errors.weddingDate}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Target Pagu Anggaran <span className="text-[#A89B95]">(opsional)</span>
            </label>
            <MaskedCurrencyInput
              dataTestId="input-target-budget"
              placeholder="cth: 150.000.000"
              value={budgetStr}
              onChange={(masked) => setBudgetStr(masked)}
            />
          </div>

          <button
            data-testid="button-start-planner"
            type="submit"
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#B86B70] hover:bg-[#a65d62] text-white text-sm font-medium tracking-wide shadow-sm transition-colors cursor-pointer"
          >
            Mulai Merencanakan
          </button>
        </form>
      </div>
    </div>
  );
};
