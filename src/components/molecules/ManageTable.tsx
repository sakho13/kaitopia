type TableHeader = {
  id: string
  label: string
}

type Props<T extends object> = {
  value: T[]
  header: TableHeader[]

  renderHeaderCell?: (header: TableHeader) => React.ReactNode
  renderBodyCell?: (
    rowIndex: number,
    item: T,
    header: TableHeader,
  ) => React.ReactNode
}

export function ManageTable<T extends object>({
  value,
  header,
  renderHeaderCell = (h) => (
    <th key={h.id} className='px-4 py-2 text-center'>
      {h.label}
    </th>
  ),
  renderBodyCell = (rowIndex, item, header) => (
    <td key={`${rowIndex}-${header.id}`} className='px-4 py-2 text-center'>
      {header.id in item ? (item as Record<string, string>)[header.id] : "-"}
    </td>
  ),
}: Props<T>) {
  return (
    <table className='w-full shadow rounded-xl overflow-hidden'>
      <thead className='bg-background-subtle text-left text-sm'>
        <tr>{header.map((h) => renderHeaderCell(h))}</tr>
      </thead>

      <tbody>
        {value.map((item, rowIndex) => (
          <tr key={rowIndex}>
            {header.map((h, colIndex) =>
              renderBodyCell(rowIndex, item, header[colIndex]),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
