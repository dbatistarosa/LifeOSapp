import clsx from 'clsx';

export default function Input({
  label,
  error,
  className = '',
  type = 'text',
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-text-secondary">{label}</label>
      )}
      <input
        type={type}
        className={clsx(
          'w-full bg-bg-raised border border-white/10 rounded-xl px-4 py-3 text-text-primary',
          'placeholder-text-dim focus:outline-none focus:border-primary-green/50 focus:ring-1 focus:ring-primary-green/30',
          'transition-all duration-200 min-h-[44px]',
          error && 'border-red-500/50',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
