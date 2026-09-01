export default function InputLabel({
    value,
    className = '',
    required = false,
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-medium leading-6 text-gray-900 ` +
                className
            }
        >
            {value ? value : children}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
    );
}
