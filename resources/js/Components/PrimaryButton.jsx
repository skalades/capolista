export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded px-4 py-2 text-[13px] font-medium font-sans text-white bg-navy transition-colors hover:bg-navy/90 focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-1 ${
                    disabled ? 'opacity-50 cursor-not-allowed' : 'shadow-sm'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
