import React, { forwardRef, useEffect, useRef, useState, useImperativeHandle } from 'react';

export default forwardRef(function CurrencyInput(
    { className = '', value, onChange, ...props },
    ref,
) {
    const localRef = useRef(null);
    const [displayValue, setDisplayValue] = useState('');

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    // Format number to IDR format (e.g. 33.133.131)
    const formatCurrency = (val) => {
        if (val === null || val === undefined || val === '') return '';
        // Remove non-digit characters
        const numberString = val.toString().replace(/[^0-9]/g, '');
        if (!numberString) return '';
        return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    useEffect(() => {
        // Sync external value to display value if it changes externally
        setDisplayValue(formatCurrency(value));
    }, [value]);

    const handleChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, ''); // Extract only numbers
        setDisplayValue(formatCurrency(rawValue));
        
        // Pass the raw integer to the parent component
        if (onChange) {
            // Create a fake event object to maintain compatibility with standard onChange handlers
            onChange({
                ...e,
                target: {
                    ...e.target,
                    name: props.name,
                    value: rawValue ? parseInt(rawValue, 10) : ''
                }
            });
        }
    };

    return (
        <input
            {...props}
            type="text"
            className={
                'block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6 transition-shadow duration-200 ' +
                className
            }
            value={displayValue}
            onChange={handleChange}
            ref={localRef}
        />
    );
});
