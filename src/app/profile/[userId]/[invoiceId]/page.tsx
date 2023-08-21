"use client";

import ShowInvoice from "@/components/invoice/ShowInvoice";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import { IoIosArrowBack } from "react-icons/io";
import InvoiceForm from "@/components/invoice/InvoiceForm";
import { toast } from "react-hot-toast";

const InvoicePage = () => {
  const params = useParams();
  const [user, setUser] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const router = useRouter();

  const [edit, setEdit] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/users/user");
        setUser(response.data);
        console.log(user);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchInvoice = async() => {
      const invoiceRes = await axios.post('/api/invoices/get-invoice', { userId: params.userId, invoiceId: params.invoiceId });

      setInvoice(invoiceRes.data);
      setPaid(invoiceRes?.data?.status === "Paid" ? true : false);
    };

    fetchUser();
    fetchInvoice();
  }, []);

  const goBack = () => {
    router.back();
  };

  const markAsPaid = async() => {
    if(paid){
      invoice.status = "Unpaid"
    }
    else{
      invoice.status = "Paid"
    }
    const requestData = {
      userId: params.userId,
      invoiceId: params.invoiceId,
      invoiceData: invoice,
    }
    const response = await axios.post('/api/invoices/update-invoice', requestData);
    console.log(response);
    console.log("Invoice updated succesfully");
    setPaid(!paid);
  }

  const editInvoice = () => {
    setEdit(true);
  }

  const saveChanges = () => {
    setEdit(false);
  }

  const deleteInvoice = async() => {
    const response = await axios.post('/api/invoices/delete-invoice', {userId: user?.data?._id, invoiceId: invoice?._id})
    if(response.status === 200){
      router.back();
      toast.success("Invoice Deleted Successfully!");
    }
  }

  return (
    <div>
      <Navbar btn="LOGOUT" />
      {user && invoice ? (
        <div className="m-2 mx-3">
          <div className="flex flex-row w-full gap-10">
            <div className="w-1/6">
              <div className="flex flex-col w-1/6 rounded-lg gap-8 fixed mt-4">
                {/* <div
                  onClick={goBack}
                  className="cursor-pointer text-lg flex flex-row items-center gap-2"
                >
                  <IoIosArrowBack /> Go Back
                </div> */}
                <div className="text-[22px] items-center flex flex-row gap-x-3 w-full">
                  <span className="font-semibold">Status: </span>
                  <span className={`${invoice.status == "Paid" ? "bg-green-700" : "bg-[#fa983a]"} text-white w-full p-2 rounded-md justify-center items-center flex shadow-sm text-lg`}>
                    {invoice?.status}
                  </span>
                </div>
                <div className="flex flex-col gap-3 text-lg">
                  <button className={`${paid ? "bg-[#fa983a]" : "bg-green-700"} p-2 px-3 border rounded-md text-white  shadow-sm`} onClick={markAsPaid}>
                    {paid ? "Mark as Unpaid" : "Mark as Paid"}
                  </button>
                  <button className="p-2 px-3 border rounded-md text-white bg-[#192a56] shadow-sm" onClick={edit ? saveChanges : editInvoice}>
                    {edit ? "Save Changes" : "Edit"}
                  </button>
                  <button className="p-2 px-3 border rounded-md text-white bg-red-700  shadow-sm" onClick={deleteInvoice}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <div>
              <ShowInvoice user={user} invoice={invoice} edit={edit}/>
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default InvoicePage;
