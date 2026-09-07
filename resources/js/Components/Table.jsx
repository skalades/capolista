export default function Table({ children, className = '', ...props }) {
    return (
        <div className={`overflow-x-auto w-full ${className}`}>
            <table className="min-w-full text-left border-collapse" {...props}>
                {children}
            </table>
        </div>
    );
}

Table.Head = function TableHead({ children, className = '', ...props }) {
    return (
        <thead className={`border-b border-line ${className}`} {...props}>
            <tr>{children}</tr>
        </thead>
    );
};

Table.HeadCell = function TableHeadCell({ children, className = '', ...props }) {
    return (
        <th className={`px-4 py-3 text-[11px] font-sans font-bold text-ink uppercase tracking-wider ${className}`} {...props}>
            {children}
        </th>
    );
};

Table.Body = function TableBody({ children, className = '', ...props }) {
    return (
        <tbody className={`divide-y divide-line bg-transparent ${className}`} {...props}>
            {children}
        </tbody>
    );
};

Table.Row = function TableRow({ children, className = '', ...props }) {
    return (
        <tr className={`hover:bg-line/20 transition-colors ${className}`} {...props}>
            {children}
        </tr>
    );
};

Table.Cell = function TableCell({ children, className = '', ...props }) {
    return (
        <td className={`px-4 py-3 whitespace-nowrap text-[13px] font-sans text-ink ${className}`} {...props}>
            {children}
        </td>
    );
};
