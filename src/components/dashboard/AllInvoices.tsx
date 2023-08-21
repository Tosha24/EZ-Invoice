import React from 'react';

interface Props {
  onClick: (invoice_id: any) => void;
  invoice: any;
  index: any;
}

const AllInvoices = ({onClick, invoice, index} : Props) => {
  return (
    <div className={`${index%2 == 0 ? "bg-white" : "bg-[#ebeae8]"} flex flex-row border border-gray-300 p-3 justify-between flex-wrap cursor-pointer hover:bg-[#b7b6b4] hover:text-black duration-100 text-black font-semibold`} onClick={onClick}>
        <div>{index+1}</div>
        <div className='w-52'>{invoice.customerName}</div>
        <div className='w-24'>{invoice.issueDate}</div>
        <div className='w-24'>{invoice.dueDate}</div>
        <div className='w-36 flex justify-end'>{invoice.currency} {invoice.totalAmount.toFixed(2)}</div>
        <div className='w-20 flex justify-end'>{invoice.status}</div>
    </div>
  )
}

export default AllInvoices;