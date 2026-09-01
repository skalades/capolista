import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid';

export default function SearchFilter({ value, onChange, placeholder = 'Cari...' }) {
    const [searchTerm, setSearchTerm] = useState(value || '');
    const isInitialMount = useRef(true);
    const latestOnChange = useRef(onChange);

    useEffect(() => {
        latestOnChange.current = onChange;
    }, [onChange]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const timeoutId = setTimeout(() => {
            if (latestOnChange.current) {
                latestOnChange.current(searchTerm);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    return (
        <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
                type="text"
                className="block w-full rounded-md border-0 py-2 pl-10 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6 transition-shadow"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => setSearchTerm('')}
                    >
                        <span className="sr-only">Clear search</span>
                        <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>
            )}
        </div>
    );
}
