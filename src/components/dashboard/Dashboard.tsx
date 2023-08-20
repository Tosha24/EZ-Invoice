"use client";

import React, { useEffect, useState } from 'react'
import InvoiceTotal from './InvoiceTotal'
import AllInvoices from './AllInvoices'
import { useParams, useRouter } from 'next/navigation'
import Loading from '../Loading';
import Link from 'next/link';

interface Props {
  user: any;
}

const Dashboard = ({user}: Props) => {
  const router = useRouter();
  const params = useParams();

  const [paid, setPaid] = useState(0);

  useEffect(() => {
    const findPaidInvoices = () => {
      const paidInvoices = user.data.invoices.filter((invoice: any) => invoice.status === 'Paid');
      setPaid(paidInvoices.length);
    }

    findPaidInvoices();
  }, [])

  const openInvoice = (invoice_id : String) => {
    Loading;
    router.push(`/profile/${params.userId}/${invoice_id}`);
  }

  return (
    <>
    <div className='h-full mx-'>
        <div className='p-4 flex flex-row justify-between items-center'>
            <InvoiceTotal total={user.data.invoices.length} paid={paid}/>
            <div className='p-3 px-4 flex justify-center gap-2 items-center border-hoverColor border-2 text-hoverColor font-extrabold text-lg'>
              <Link href={`/profile/${params.userId}/add-invoice`} className='no-underline'>Create New</Link>
            </div>
        </div>
        <div className='p-5 flex flex-col'>
            <div className='flex p-1 py-1.5 flex-row items-start justify-between border-b-2 bg-hoverColor text-white text-lg mb-3 font-semibold'>
              <div className='w-1 pl-2'>No.</div>
              <div className='w-52'>Client Name</div>
              <div className='w-24'>Issue Date</div>
              <div className='w-24'>Due Date</div>
              <div className='w-36 flex justify-end'>Amount</div>
              <div className='w-18 pr-2'>Status</div>
            </div>
            {
              user.data.invoices.length !== 0 ?
              user.data.invoices.map((invoice: any, index: any) => {
                console.log(invoice);
                return (
                  <AllInvoices key={invoice._id} invoice={invoice} onClick={() => openInvoice(invoice._id)} index={index}/>
                )
              }) : (
                <div className='flex justify-center text-xl'>
                  No Invoices Found!
                </div>
              )
            }
        </div>
    </div>
</>
  )
}

export default Dashboard;