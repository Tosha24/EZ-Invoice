import React from "react";

interface Props {
  total: Number;
  paid?: Number;
}

const InvoiceTotal = ({total, paid=0} : Props) => {
  return (
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
  );
};

export default InvoiceTotal;