export default function Table({ children, className = '' }) {
    return (
        <div className={`overflow-x-auto rounded-lg border border-gray-100 shadow-sm ${className}`}>
            <table className="min-w-full divide-y divide-gray-200">
                {children}
            </table>
        </div>
    );
}

Table.Head = function TableHead({ children }) {
    return (
        <thead className="bg-gray-50/75">
            <tr>{children}</tr>
        </thead>
    );
};

Table.HeadCell = function TableHeadCell({ children, className = '' }) {
    return (
        <th className={`px-6 py-3.5 text-left text-sm font-semibold text-gray-900 ${className}`}>
            {children}
        </th>
    );
};

Table.Body = function TableBody({ children }) {
    return (
        <tbody className="bg-white divide-y divide-gray-100">
            {children}
        </tbody>
    );
};

Table.Row = function TableRow({ children, className = '' }) {
    return (
        <tr className={`hover:bg-gray-50/50 transition-colors ${className}`}>
            {children}
        </tr>
    );
};

Table.Cell = function TableCell({ children, className = '' }) {
    return (
        <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-600 ${className}`}>
            {children}
        </td>
    );
};
