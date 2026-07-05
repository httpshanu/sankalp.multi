import React from 'react';

/**
 * Reusable OrganizationLogos component displaying ICMR and SANKALP logos.
 * Supports variants: 'full', 'compact', 'header', 'sidebar', 'login', 'print', 'mobile'
 */
export default function OrganizationLogos({ variant = 'full', className = '', isSidebarCollapsed = false }) {
  const icmrAlt = "Indian Council of Medical Research";
  const sankalpAlt = "SANKALP Mother and Child Health Programme";

  // Base styling classes
  const containerBase = "flex items-center select-none";

  // Variant styles mapping
  if (variant === 'sidebar') {
    if (isSidebarCollapsed) {
      return (
        <div className={`flex justify-center items-center w-full ${className}`}>
          {/* Collapsed sidebar: only SANKALP logo since it represents the app and fits a square/circle shape */}
          <div className="w-10 h-10 rounded-full bg-white/90 p-0.5 flex items-center justify-center shadow-sm overflow-hidden border border-white/25">
            <img
              src="/assets/sankalp-logo.png"
              alt={sankalpAlt}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      );
    }

    return (
      <div className={`flex items-center gap-2.5 bg-white/95 px-3 py-2 rounded-xl shadow-md border border-white/20 ${className}`}>
        <img
          src="/assets/icmr-logo.png"
          alt={icmrAlt}
          className="h-8 w-auto object-contain flex-shrink-0"
        />
        <div className="w-px h-6 bg-slate-300"></div>
        <img
          src="/assets/sankalp-logo.png"
          alt={sankalpAlt}
          className="h-8 w-auto object-contain flex-shrink-0"
        />
      </div>
    );
  }

  if (variant === 'login') {
    return (
      <div className={`flex flex-col items-center gap-4 ${className}`}>
        <div className="flex items-center justify-center gap-5 px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <img
            src="/assets/icmr-logo.png"
            alt={icmrAlt}
            className="h-14 md:h-16 w-auto object-contain"
          />
          <div className="w-px h-10 bg-slate-200"></div>
          <img
            src="/assets/sankalp-logo.png"
            alt={sankalpAlt}
            className="h-14 md:h-16 w-auto object-contain"
          />
        </div>
      </div>
    );
  }

  if (variant === 'header') {
    return (
      <div className={`${containerBase} gap-2.5 ${className}`}>
        <img
          src="/assets/icmr-logo.png"
          alt={icmrAlt}
          className="h-8 md:h-9 w-auto object-contain flex-shrink-0"
        />
        <div className="w-px h-6 bg-slate-200"></div>
        <img
          src="/assets/sankalp-logo.png"
          alt={sankalpAlt}
          className="h-8 md:h-9 w-auto object-contain flex-shrink-0"
        />
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className={`${containerBase} gap-2 flex-wrap ${className}`}>
        <img
          src="/assets/icmr-logo.png"
          alt={icmrAlt}
          className="h-7 w-auto object-contain flex-shrink-0"
        />
        <div className="w-px h-5 bg-slate-200"></div>
        <img
          src="/assets/sankalp-logo.png"
          alt={sankalpAlt}
          className="h-7 w-auto object-contain flex-shrink-0"
        />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`${containerBase} gap-1.5 ${className}`}>
        <img
          src="/assets/icmr-logo.png"
          alt={icmrAlt}
          className="h-6 w-auto object-contain"
        />
        <div className="w-px h-4 bg-slate-200"></div>
        <img
          src="/assets/sankalp-logo.png"
          alt={sankalpAlt}
          className="h-6 w-auto object-contain"
        />
      </div>
    );
  }

  if (variant === 'print') {
    return (
      <div className="flex items-center gap-6 justify-between w-full border-b-2 border-slate-800 pb-4 mb-4">
        <img
          src="/assets/icmr-logo.png"
          alt={icmrAlt}
          className="h-[50px] w-auto object-contain"
        />
        <div className="text-center flex-1">
          <h2 className="text-lg font-bold m-0 text-[#0F4C75]">SANKALP</h2>
          <p className="mt-0.5 m-0 text-slate-600 text-[10px]">
            Bedside Counselling & Neonatal Follow-up Management System
          </p>
        </div>
        <img
          src="/assets/sankalp-logo.png"
          alt={sankalpAlt}
          className="h-[50px] w-auto object-contain"
        />
      </div>
    );
  }

  // Default 'full' variant
  return (
    <div className={`${containerBase} gap-4 px-4 py-3 bg-slate-50/50 rounded-xl border border-slate-100 ${className}`}>
      <img
        src="/assets/icmr-logo.png"
        alt={icmrAlt}
        className="h-10 md:h-12 w-auto object-contain"
      />
      <div className="w-px h-8 bg-slate-200"></div>
      <img
        src="/assets/sankalp-logo.png"
        alt={sankalpAlt}
        className="h-10 md:h-12 w-auto object-contain"
      />
    </div>
  );
}
