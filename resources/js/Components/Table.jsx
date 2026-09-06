export default function Table({ children, className = '' }) {
    return (
        <div className={`overflow-x-auto w-full ${className}`}>
            <table className="min-w-full text-left border-collapse">
                {children}
            </table>
        </div>
    );
}

Table.Head = function TableHead({ children }) {
    return (
        <thead className="border-b border-line">
            <tr>{children}</tr>
        </thead>
    );
};

Table.HeadCell = function TableHeadCell({ children, className = '' }) {
    return (
        <th className={`px-4 py-3 text-[11px] font-sans font-medium text-ink-soft lowercase tracking-wide font-normal ${className}`}>
            {children}
        </th>
    );
};

Table.Body = function TableBody({ children }) {
    return (
        <tbody className="divide-y divide-line bg-transparent">
            {children}
        </tbody>
    );
};

Table.Row = function TableRow({ children, className = '' }) {
    return (
        <tr className={`hover:bg-accent/5 transition-colors ${className}`}>
            {children}
        </tr>
    );
};

Table.Cell = function TableCell({ children, className = '' }) {
    return (
        <td className={`px-4 py-3 whitespace-nowrap text-[13px] font-sans text-ink ${className}`}>
            {children}
        </td>
    );
};
