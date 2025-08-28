export const Table = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <table
      className={` w-full text-left rtl:text-right text-gray-500 dark:text-gray-400 cursor-pointer ${className}`}
    >
      {children}
    </table>
  );
};

export function TableHead({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <thead className={`text-xs uppercase  ${className}`}>{children}</thead>
  );
}

export function TableHeaderCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={`px-4 py-3 font-bold text-center ${className}`}>
      {children}
    </th>
  );
}

export function TableBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tbody className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>
      {children}
    </tbody>
  );
}

export function TableRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr
      className={`text-center bg-white border-b dark:bg-gray-800 dark:border-gray-700 transition delay-150 duration-500 hover:bg-gray-100 dark:hover:bg-gray-600 ${className}`}
    >
      {children}
    </tr>
  );
}

export const TableCell: React.FC<{
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}> = ({ children, className, colSpan }) => (
  <td className={`font-medium ${className}`} colSpan={colSpan}>
    {children}
  </td>
);
