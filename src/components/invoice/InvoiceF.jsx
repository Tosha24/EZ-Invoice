import React, { useState, useEffect } from "react";
import InvoiceI from "./InvoiceI";
import InvoiceM from "./InvoiceM";
import moment from "moment";
import Loading from "@/components/Loading";
import { BiSolidPhone } from "react-icons/bi";

function InvoiceF (props) {
    const [userData, setUserData] = useState({
      companyName: props.user.data.companyName,
      email: props.user.data.email,
      gstin: props.user.data.gstin,
      contact: props.user.data.contact,
      address: props.user.data.address,
      city: props.user.data.city,
      state: props.user.data.state,
    });
    const [invoiceData, setInvoiceData] = useState(null);
    const [itemsData, setItemsData] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const edit = props.edit;
    const save = props.save;

    useEffect(() => {
        if(props?.invoice){
            setInvoiceData(props.invoice);
            setItemsData(props.invoice.items);
        }
        else{
            const currentDate = moment().format("DD-MM-YYYY");
            setInvoiceData({
              invoiceNumber: 1,
              issueDate: currentDate,
              dueDate: "",
              customerName: "",
              customerEmail: "",
              customerGstin: "",
              customerAddress: "",
              customerCity: "",
              customerState: "",
              customerContact: "",
              currency: "₹",
              subTotal: "0.00",
              taxRate: "",
              taxAmount: "0.00",
              totalAmount: "0.00",
              discountRate: "",
              discountAmount: "0.00",
              status: "Unpaid",
              notes: "",
            });
            setItemsData([
                {
                    id: 0,
                    name: "",
                    description: "",
                    price: "0.00",
                    quantity: 1,
                }
            ])
        }
        handleCalculateTotal();
    }, []);

    console.log("InvoiceData:", invoiceData);
    console.log("ItemsData:", itemsData);

    const handleRowDelete = (itemToBeDeleted) => {
        const newItemsData = itemsData.filter((item) => {
            return item.id !== itemToBeDeleted.id;
        });
        setItemsData(newItemsData);
        handleCalculateTotal();
    }

    const handleAddEvent = (event) => {
        var id = itemsData.length + 1;
        var newItem = {
            id: id,
            name: "",
            price: "0.00",
            description: "",
            quantity: 1,
        };
        setItemsData((prevItemsData) => [...prevItemsData, newItem]);
        handleCalculateTotal();
    }

    const handleCalculateTotal = () => {
        var items = itemsData;
        var subTotal = 0;

        items?.forEach((item) => {
            subTotal = parseFloat(parseFloat(subTotal) + parseFloat(item.price).toFixed(2) * parseInt(item.quantity)).toFixed(2);
        });

        setInvoiceData((prevState) => {
          var newSubTotal = parseFloat(subTotal).toFixed(2);
          var newTaxAmount = parseFloat(parseFloat(newSubTotal) * (prevState.taxRate / 100)).toFixed(2);
          var newDiscountAmount = parseFloat(newSubTotal) * (prevState.discountRate / 100).toFixed(2);
          var newTotalAmount = parseFloat(newSubTotal - newDiscountAmount + newTaxAmount).toFixed(2);

          return {
            ...prevState,
            subTotal: newSubTotal,
            taxAmount: newTaxAmount,
            discountAmount: newDiscountAmount,
            totalAmount: newTotalAmount,
          };
        });
    }

    const onItemizedItemEdit = (evt) => {
        var item = {
            id: evt.target.id,
            name: evt.target.name,
            value: evt.target.value,
        };

        var items = props?.invoice?.items.slice() || itemsData.slice();

        var newItems = items?.map(function (items) {
            for(var key in items) {
                if(key == item.name && items.id == item.id){
                    items[key] = item.value;
                }
            }
            return items;
        });
        
        setItemsData(newItems);
        handleCalculateTotal();
    }

    const editField = (event) => {
        setInvoiceData((prevData) => {
            return {
                ...prevData,
                [event.target.name]: event.target.value,
            }
        });
        handleCalculateTotal();
    }

    const onCurrencyChange = (selectedOption) => {
        setInvoiceData((prevData) => {
            return {
                ...prevData,
                currency: selectedOption,
            }
        });
    }

    const onStatusChange = (selectedOption) => {
        setInvoiceData((prevData) => {
            return {
                ...prevData,
                status: selectedOption,
            }
        });
    }

    const openModal = (event) => {
        event.preventDefault();
        handleCalculateTotal();
        setIsOpen(true);
    }

    const closeModal = (event) => {
        event.preventDefault();
        setIsOpen(false);
    }

    const user = props?.user;
        
    return (
        <>
        { isLoading ? (
          <Loading />
        ) : (
          <div>
            <form onSubmit={openModal}>
              <div className="flex flex-row gap-4 items-start justify-center">
                <div className="flex flex-col col-md-6 col-lg-9">
                  <div className="border border-gray-200 rounded-lg p-4 p-xl-5 my-3 my-xl-4">
                    <div className="flex flex-row items-start justify-between mb-3">
                      <div className="flex flex-col">
                        <div className="flex flex-col">
                          <div className="mb-2">
                            <span className="font-bold">Current Date: </span>
                            <span>{invoiceData?.issueDate}</span>
                          </div>
                        </div>
                        <div className="flex flex-row items-center">
                          <span className="font-bold block mr-2">
                            Due Date:{" "}
                          </span>
                          <input
                            type="date"
                            value={invoiceData?.dueDate}
                            name="dueDate"
                            onChange={(event) => editField(event)}
                            className={`${!edit && "hidden"} max-w-xs pl-4 p-2 rounded-lg bg-borderColor border`}
                            required
                          />
                          <span className={`${edit && "hidden"}`}>{invoiceData?.dueDate}</span>
                        </div>
                      </div>
                      <div className='flex flex-col gap-2'>
                      <div className="flex flex-row items-center">
                        <span className="font-bold me-2">Invoice Number: </span>
                        <input
                          type="number"
                          className="w-16 bg-borderColor p-2 rounded-lg pl-3 border"
                          value={invoiceData?.invoiceNumber}
                          name="invoiceNumber"
                          onChange={(event) => editField(event)}
                          min="1"
                          required
                          disabled={!edit}
                        />
                      </div>
                      <div className='flex flex-row items-center'>
                        <span className='font-bold me-2'>Status: </span>
                        <select className='border p-1 rounded-lg bg-borderColor px-3'
                        onChange={(event) =>
                          onStatusChange({
                            status: event.target.value,
                          })
                        } disabled={!edit}>
                          <option value="Unpaid">Unpaid</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </div>  
                      </div>
                    </div>
                    <hr className="my-4" />
                    <div className="mb-5 flex flex-row gap-4">
                      <div className="w-full flex flex-col gap-2">
                        <label className="font-bold">Bill to:</label>
                        <input
                          placeholder="Who is this invoice to?"
                          className="w-full placeholder:text-gray-600 pl-3 p-2 border bg-borderColor rounded-lg"
                          value={invoiceData?.customerName}
                          type="text"
                          name="customerName"
                          onChange={(event) => editField(event)}
                          autoComplete="off"
                          required
                          disabled={!edit}
                        />
                        <input
                          placeholder="GSTIN"
                          className="w-full placeholder:text-gray-600 pl-3 p-2 border bg-borderColor rounded-lg uppercase"
                          value={invoiceData?.customerGstin}
                          type="text"
                          name="customerGstin"
                          onChange={(event) => editField(event)}
                          autoComplete="off"
                          maxLength={15}
                          required
                          disabled={!edit}
                        />
                        
                        <input
                          placeholder="Address Line 1"
                          className="w-full placeholder:text-gray-600 pl-3 p-2 border bg-borderColor rounded-lg"
                          value={invoiceData?.customerAddress}
                          type="text"
                          name="customerAddress"
                          onChange={(event) => editField(event)}
                          autoComplete="off"
                          maxLength={50}
                          required
                          disabled={!edit}
                        />
                        <input
                          placeholder="City"
                          className="w-full placeholder:text-gray-600 pl-3 p-2 border bg-borderColor rounded-lg"
                          value={invoiceData?.customerCity}
                          type="text"
                          name="customerCity"
                          onChange={(event) => editField(event)}
                          autoComplete="off"
                          required
                          disabled={!edit}
                        />
                        <input
                          placeholder="State"
                          className="w-full placeholder:text-gray-600 pl-3 p-2 border bg-borderColor rounded-lg"
                          value={invoiceData?.customerState}
                          type="text"
                          name="customerState"
                          onChange={(event) => editField(event)}
                          autoComplete="off"
                          required
                          disabled={!edit}
                        />
                        <div className='flex flex-row group'>
                          <div className='flex items-center justify-center p-1 rounded-l-lg border bg-gray-100 font-semibold'>@</div>
                          <input
                            placeholder="Email address"
                            className="w-full placeholder:text-gray-600 pl-3 p-2 border bg-borderColor rounded-r-lg"
                            value={invoiceData?.customerEmail}
                            type="email"
                            name="customerEmail"
                            onChange={(event) => editField(event)}
                            autoComplete="off"
                            required
                            disabled={!edit}
                          />
                        </div>
                        <div className="flex flex-row group">
                          <div className="items-center justify-center flex bg-gray-100 border rounded-l-lg p-1 font-medium">
                            <BiSolidPhone/>
                          </div>
                          <input
                            placeholder="Contact"
                            className="w-full placeholder:text-gray-600 pl-3 p-2 border bg-borderColor rounded-r-lg"
                            value={invoiceData?.customerContact}
                            type="tel"
                            name="customerContact"
                            onChange={(event) => editField(event)}
                            maxLength={10}
                            autoComplete="off"
                            required
                            disabled={!edit}
                          />
                        </div>
                      </div>
                      <div className="w-full flex flex-col gap-2">
                        <label className="font-bold">Bill from:</label>
                        <input
                          placeholder="Who is this invoice from?"
                          className="w-full placeholder:text-gray-600 pl-3 p-2 bg-white border border-borderColor rounded-lg"
                          value={userData.companyName}
                          type="text"
                          name="companyName"
                          disabled 
                        />
                        <input
                          placeholder="GSTIN No."
                          className="w-full placeholder:text-gray-600 pl-3 p-2 bg-white border border-borderColor rounded-lg"
                          value={userData.gstin}
                          type="text"
                          name="gstin"
                          disabled
                        />
                        
                        <input
                          placeholder="Billing address"
                          className="w-full placeholder:text-gray-600 pl-3 p-2 bg-white border border-borderColor rounded-lg"
                          value={userData.address}
                          type="text"
                          name="address"
                          disabled
                        />
                        <input
                          placeholder="City"
                          className="w-full placeholder:text-gray-600 pl-3 p-2 bg-white border border-borderColor rounded-lg"
                          value={userData.city}
                          type="text"
                          name="city"
                          disabled
                        />
                        <input
                          placeholder="State"
                          className="w-full placeholder:text-gray-600 pl-3 p-2 bg-white border border-borderColor rounded-lg"
                          value={userData.state}
                          type="text"
                          name="state"
                          disabled
                        />
                        <div className='flex flex-row group'>
                          <div className='flex items-center justify-center p-1 rounded-l-lg border bg-gray-100 font-semibold'>@</div>
                          <input
                          placeholder="Email address"
                          className="w-full placeholder:text-gray-600 pl-3 p-2 bg-white border border-borderColor rounded-r-lg"
                          value={userData.email}
                          type="email"
                          name="email"
                          disabled
                        />
                        </div>
                        <div className="flex flex-row group">
                          <div className="items-center justify-center flex bg-gray-100 border rounded-l-lg p-1 font-medium">
                            <BiSolidPhone/>
                          </div>
                          <input
                            placeholder="Contact"
                            className="w-full placeholder:text-gray-600 pl-3 p-2 border border-borderColor bg-white rounded-r-lg"
                            value={userData.contact}
                            type="tel"
                            name="contact"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    <InvoiceI
                      onItemizedItemEdit={onItemizedItemEdit}
                      onRowAdd={handleAddEvent}
                      onRowDel={handleRowDelete}
                      currency={invoiceData?.currency}
                      itemsData={itemsData}
                      edit={edit}
                    />
                    <div className="flex flex-end mt-4 justify-content-end">
                      <div className="col-lg-6">
                        <div className="flex flex-row items-start justify-between">
                          <span className="font-bold">Subtotal: </span>
                          <span>
                            {invoiceData?.currency}
                            {invoiceData?.subTotal}
                          </span>
                        </div>
                        <div className="flex flex-row items-start justify-between mt-2">
                          <span className="font-bold">Discount:</span>
                          <span>
                            <span>({invoiceData?.discountRate || 0}%)</span>
                            {invoiceData?.currency}
                            {invoiceData?.discountAmount || 0}
                          </span>
                        </div>
                        <div className="flex flex-row items-start justify-between mt-2">
                          <span className="font-bold">Tax:</span>
                          <span>
                            <span>({invoiceData?.taxRate || 0}%)</span>
                            {invoiceData?.currency}
                            {invoiceData?.taxAmount || 0}
                          </span>
                        </div>
                        <hr />
                        <div className="flex font-xl flex-row items-start justify-between">
                          <span className="font-bold">Total:</span>
                          <span className="font-bold">
                            {invoiceData?.currency}
                            {invoiceData?.totalAmount || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    <hr className="my-4" />
                    <label className="font-bold">Notes:</label>
                    <textarea
                      placeholder="Thanks for your business!"
                      name="notes"
                      value={invoiceData?.notes}
                      onChange={(event) => editField(event)}
                      className="my-2 block w-full placeholder:text-gray-600 bg-borderColor rounded-sm p-2"
                      rows="2"
                      autoComplete="off"
                      disabled={!edit}
                    />
                  </div>
                </div>
                <div className="flex flex-col col-md-4 col-lg-2">
                  <div className="fixed pt-md-3 pt-xl-4">
                    <button
                      type="submit"
                      className={`${!edit && "bg-primaryColor/40 hover:bg-primaryColor/40 cursor-not-allowed" } block w-full bg-primaryColor hover:bg-hoverColor text-lg text-white tracking-wider py-2 rounded-lg`}
                    >
                      Review Invoice
                    </button>
                    <div className="mt-3 mb-3 w-full flex flex-col group">
                      <label className="font-bold">Currency: </label>
                      <select
                        onChange={(event) =>
                          onCurrencyChange({
                            currency: event.target.value,
                          })
                        }
                        className="bg-borderColor p-2 rounded-lg items-center my-1 border border-borderColor"
                        aria-label="Change Currency"
                        disabled={!edit}
                      >
                        <option value="₹">INR (Indian Rupees)</option>
                        <option value="$">USD (United States Dollar)</option>
                        <option value="£">GBP (British Pound Sterling)</option>
                        <option value="¥">JPY (Japanese Yen)</option>
                        <option value="₿">BTC (Bitcoin)</option>
                      </select>
                    </div>
                    <div className="my-3">
                      <label className="font-bold">Tax rate:</label>
                      <div className="my-1 flex flex-nowrap group">
                        <input
                          name="taxRate"
                          type="number"
                          value={invoiceData?.taxRate}
                          onChange={(event) => editField(event)}
                          className="w-11/12 p-2 bg-white border border-r-0 border-borderColor rounded-l-md"
                          placeholder="0.0"
                          min="0.00"
                          step="0.01"
                          max="100.00"
                          disabled={!edit}
                        />
                        <span className="bg-gray-50 w-2/12 border rounded-r-md border-borderColor p-1 font-bold text-gray-500 flex items-center justify-center">
                          %
                        </span>
                      </div>
                    </div>
                    <div className="my-3">
                      <label className="font-bold">Discount rate:</label>
                      <div className="my-1 flex flex-nowrap group">
                        <input
                          className="w-11/12 p-2 bg-white border border-r-0 border-borderColor rounded-l-md"
                          type="number"
                          name="discountRate"
                          value={invoiceData?.discountRate}
                          onChange={(event) => editField(event)}
                          placeholder="0.0"
                          min="0.00"
                          step="0.01"
                          max="100.00"
                          disabled={!edit}
                        />
                        <span className="bg-gray-50 w-2/12 border rounded-r-md border-borderColor p-1 font-bold text-secondary flex items-center justify-center">
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {isOpen && (
          <div className="w-full h-full bg-neutral-900/80 z-30 top-0 right-0 left-0 bottom-0 fixed items-center justify-center flex overflow-y-scroll scrollbar-none pt-24">
            <InvoiceM
              showModal={isOpen}
              closeModal={closeModal}
              invoiceData={invoiceData}
              itemsData={itemsData}
              userData={userData}
              edit={edit}
              save={save}
            />
          </div>
        )}
      </>
    );
}

export default InvoiceF;