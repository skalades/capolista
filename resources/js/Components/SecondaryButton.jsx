export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center justify-center rounded px-4 py-2 text-[13px] font-medium font-sans text-ink bg-panel border border-line transition-colors hover:bg-line/20 focus:outline-none focus:ring-2 focus:ring-line focus:ring-offset-1 ${
                    disabled ? 'opacity-50 cursor-not-allowed' : 'shadow-sm'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
