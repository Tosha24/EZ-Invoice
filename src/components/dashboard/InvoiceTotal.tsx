import React from "react";
import { CSVLink } from "react-csv";

interface Props {
  total: Number;
  paid?: Number;
  user: any;
}

const InvoiceTotal = ({total, paid=0, user} : Props) => {
  const headers = [
    { label: "Invoice No." , key: "invoiceNumber", type: "number" },
    { label: "Issue Date" , key: "issueDate", type: "date" },
    { label: "Due Date" , key: "dueDate", type: "date" },
    { label: "Client Name" , key: "customerName", type: "string" },
    { label: "Client Email" , key: "customerEmail", type: "string" },
    { label: "Client Contact" , key: "customerContact", type: "number" },
    { label: "Client GSTIN" , key: "customerGstin", type: "string" },
    { label: "Address Line 1" , key: "customerAddress", type: "string" },
    { label: "City" , key: "customerCity", type: "string" },
    { label: "State" , key: "customerState", type: "string" },
    { label: "Items" , key: "items", type: "string" },
    { label: "Currency" , key: "currency", type: "string" },
    { label: "Sub Total" , key: "subTotal", type: "number" },
    { label: "Tax Rate (%)" , key: "taxRate", type: "number" },
    { label: "Tax Amount" , key: "taxAmount", type: "number" },
    { label: "Discount Rate (%)" , key: "discountRate", type: "number" },
    { label: "Discount Amount" , key: "discountAmount", type: "number" },
  ];

  return (
    <div className='flex flex-row w-full justify-between'>
      <div className="flex flex-row justify-start gap-6">
      <div className="bg-[#d4b0f6] p-2 px-3 font-extrabold flex flex-row justify-center gap-2 items-center rounded-md text-black text-lg shadow-shadow">
        <div className="">Total Invoices: </div>
        <div className="">{total.toFixed(0)}</div>
      </div>
      <div className="bg-[#d4b0f6] p-2 px-3 font-extrabold flex flex-row justify-center gap-2 items-center rounded-md text-black text-lg shadow-shadow">
        <div className="">Paid Invoices:</div>
        <div className="">{paid.toFixed(0)}</div>
      </div>
      <div className="bg-[#d4b0f6] p-2 px-3 font-extrabold flex flex-row items-center gap-2 justify-center rounded-md text-black text-lg shadow-shadow">
        <div className="">Unpaid Invoices:</div>
        <div className="">{parseInt(total.toFixed(0)) - parseInt(paid.toFixed(0))}</div>
      </div>
    </div>
    <div className='bg-[#d4b0f6] p-2 px-3 font-extrabold flex flex-row items-center gap-2 justify-center rounded-md text-black text-lg shadow-shadow cursor-pointer'>
      <div>
        <CSVLink data={user.data.invoices} headers={headers} filename={`${user.data.companyName}.csv`} className='no-underline text-black'>Export data</CSVLink>
      </div>
    </div>
    </div>
  );
};

export default InvoiceTotal;