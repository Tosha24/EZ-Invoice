import React, { useEffect, useState } from "react";
import { BiSolidPhone } from "react-icons/bi";
import InvoiceItem from "./InvoiceItem";
import ShowModal from "./ShowModal";

interface Props {
  user: any;
  invoice?: any;
  edit?: boolean;
}

const ShowInvoice = ({ user, invoice, edit }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [localUser, setUser] = useState({
    currentDate: invoice.issueDate,
    dateOfIssue: invoice.dueDate,
    invoiceNumber: invoice.invoiceNumber,
    billTo: invoice.customerName,
    billToEmail: invoice.customerEmail,
    billToContact: invoice.customerContact,
    billToGstin: invoice.customerGstin,
    billToAddress: invoice.customerAddress,
    billToCity: invoice.customerCity,
    billToState: invoice.customerState,
    currency: invoice.currency,
    subTotal: invoice.subTotal,
    taxRate: invoice.taxRate,
    taxAmount: invoice.taxAmount,
    discountRate: invoice.discountRate,
    discountAmount: invoice.discountAmount,
    total: invoice.totalAmount,
    notes: invoice.notes,
    items: [
      {
        id: "",
        name: "",
        description: "",
        price: "0.00",
        quantity: 1,
      },
    ],
  });

  useEffect(() => {
    if(edit){
      handleCalculateTotal();
    }
  }, [localUser.items])

  const editField = (event: any) => {
    setUser({
      ...localUser,
      [event.target.name]: event.target.value,
    });
  };

  const onCurrencyChange = (selectedOption: any) => {
    setUser({
      ...localUser,
      currency: selectedOption,
    });
  };

  const handleAddEvent = () => {
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);

    setUser({
      ...localUser,
      items: [
        ...localUser.items,
        {
          id: id,
          name: "",
          description: "",
          price: "0.00",
          quantity: 1,
        },
      ],
    });

    handleCalculateTotal();
  };

  const handleCalculateTotal = () => {
    var items = localUser.items;
    var subTotal = 0;

    items.forEach((item) => {
      var price = parseFloat(item.price);
      subTotal = subTotal + price * item.quantity;
    });

    setUser({
      ...localUser,
      subTotal: subTotal.toFixed(2),
      taxAmount: (subTotal * (parseFloat(localUser.taxRate) / 100)).toFixed(2),
      discountAmount: (
        subTotal *
        (parseFloat(localUser.discountRate) / 100)
      ).toFixed(2),
      total: (
        subTotal +
        subTotal * (parseFloat(localUser.taxRate) / 100) -
        subTotal * (parseFloat(localUser.discountRate) / 100)
      ).toFixed(2),
    });
  };

  const onItemizedItemEdit = (evt: any) => {
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value,
    };

    var items = localUser.items.slice();

    var newItems = items.map(function (items: any) {
      for (var key in items) {
        if (key == item.name && items.id == item.id) {
          items[key] = item.value;
        }
      }
      return items;
    });

    setUser({
      ...localUser,
      items: newItems,
    });
    handleCalculateTotal();
  };

  const handleRowDelete = (items: any) => {
    var index = localUser.items.indexOf(items);
    localUser.items.splice(index, 1);
    setUser({
      ...localUser,
      items: localUser.items,
    });
    handleCalculateTotal();
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
    <div>
      <form onSubmit={openModal}>
        <div className="flex flex-row gap-12 items-start justify-center">
          <div className="flex flex-col md:col-span-6 col-lg-9">
            <div className="border border-gray-200 rounded-lg p-4 xl:p-5 my-3 xl:my-4">
              <div className="flex flex-row items-start justify-between mb-3">
                <div className="flex flex-col">
                  <div className="flex flex-col">
                    <div className="mb-2">
                      <span className="font-bold">Current Date: </span>
                      <span>
                        {localUser.currentDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-row items-center">
                    <span className="font-bold block mr-2">Due Date: </span>
                    <input
                      type="date"
                      value={localUser.dateOfIssue}
                      name="dateOfIssue"
                      onChange={(event) => editField(event)}
                      className={`${!edit && "hidden"} max-w-[150px] pl-4 p-[6px] rounded-lg bg-borderColor border`}
                      
                    />
                    <span className={`${edit && "hidden"}`}>{invoice.dueDate}</span>
                  </div>
                </div>
                <div className="flex flex-row items-center">
                  <span className="font-bold me-2">Invoice Number: </span>
                  <input
                    type="number"
                    className={`${!edit && "hidden"} max-w-[70px] bg-borderColor p-[6px] rounded-lg pl-3 border`}
                    value={localUser.invoiceNumber}
                    name="invoiceNumber"
                    onChange={(event) => editField(event)}
                    min="1"
                    
                  />
                  <span className={`${edit && 'hidden'} text-lg`}>{invoice.invoiceNumber}</span>
                </div>
              </div>
              <hr className="my-4"/>
              <div className="mb-5 flex flex-row gap-4">
                <div className="w-full flex flex-col gap-2">
                  <label className="font-bold">Bill to:</label>
                  <input
                    placeholder="Who is this invoice to?"
                    className="w-full placeholder:text-gray-600 pl-3 p-[6px] border bg-borderColor rounded-lg"
                    value={localUser.billTo}
                    type="text"
                    name="billTo"
                    onChange={(event) => editField(event)}
                    autoComplete="off"
                    
                  />
                  <input
                    placeholder="GSTIN"
                    className="w-full placeholder:text-gray-600 pl-3 p-[6px] border bg-borderColor rounded-lg uppercase"
                    value={localUser.billToGstin}
                    type="text"
                    name="billToGstin"
                    onChange={(event) => editField(event)}
                    autoComplete="off"
                    maxLength={15}
                    
                  />

                  <input
                    placeholder="Address Line 1"
                    className="w-full placeholder:text-gray-600 pl-3 p-[6px] border bg-borderColor rounded-lg"
                    value={localUser.billToAddress}
                    type="text"
                    name="billToAddress"
                    onChange={(event) => editField(event)}
                    autoComplete="off"
                    maxLength={50}
                    
                  />
                  <input
                    placeholder="City"
                    className="w-full placeholder:text-gray-600 pl-3 p-[6px] border bg-borderColor rounded-lg"
                    value={localUser.billToCity}
                    type="text"
                    name="billToCity"
                    onChange={(event) => editField(event)}
                    autoComplete="off"
                    
                  />
                  <input
                    placeholder="State"
                    className="w-full placeholder:text-gray-600 pl-3 p-[6px] border bg-borderColor rounded-lg"
                    value={localUser.billToState}
                    type="text"
                    name="billToState"
                    onChange={(event) => editField(event)}
                    autoComplete="off"
                    
                  />
                  <div className="flex flex-row group">
                    <div className="flex items-center justify-center p-1 rounded-l-lg border bg-gray-100 font-semibold">
                      @
                    </div>
                    <input
                      placeholder="Email address"
                      className="w-full placeholder:text-gray-600 pl-3 p-[6px] border bg-borderColor rounded-r-lg"
                      value={localUser.billToEmail}
                      type="email"
                      name="billToEmail"
                      onChange={(event) => editField(event)}
                      autoComplete="off"
                      
                    />
                  </div>
                  <div className="flex flex-row group">
                    <div className="items-center justify-center flex bg-gray-100 border rounded-l-lg p-1 font-medium">
                      <BiSolidPhone />
                    </div>
                    <input
                      placeholder="Contact"
                      className="w-full placeholder:text-gray-600 pl-3 p-[6px] border bg-borderColor rounded-r-lg"
                      value={localUser.billToContact}
                      type="tel"
                      name="billToContact"
                      onChange={(event) => editField(event)}
                      maxLength={10}
                      autoComplete="off"
                      
                    />
                  </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                  <label className="font-bold">Bill from:</label>
                  <input
                    placeholder="Who is this invoice from?"
                    className="w-full placeholder:text-gray-600 pl-3 p-[6px] bg-white border border-borderColor rounded-lg"
                    value={user.data.companyName}
                    type="text"
                    name="billFrom"
                    disabled
                  />
                  <input
                    placeholder="GSTIN No."
                    className="w-full placeholder:text-gray-600 pl-3 p-[6px] bg-white border border-borderColor rounded-lg"
                    value={user.data.gstin}
                    type="text"
                    name="gstin"
                    disabled
                  />

                  <input
                    placeholder="Billing address"
                    className="w-full placeholder:text-gray-600 pl-3 p-[6px] bg-white border border-borderColor rounded-lg"
                    value={user.data.address}
                    type="text"
                    name="billFromAddress"
                    disabled
                  />
                  <input
                    placeholder="City"
                    className="w-full placeholder:text-gray-600 pl-3 p-[6px] bg-white border border-borderColor rounded-lg"
                    value={user.data.city}
                    type="text"
                    name="billFromCity"
                    disabled
                  />
                  <input
                    placeholder="State"
                    className="w-full placeholder:text-gray-600 pl-3 p-[6px] bg-white border border-borderColor rounded-lg"
                    value={user.data.state}
                    type="text"
                    name="billFromState"
                    disabled
                  />
                  <div className="flex flex-row group">
                    <div className="flex items-center justify-center p-1 rounded-l-lg border bg-gray-100 font-semibold">
                      @
                    </div>
                    <input
                      placeholder="Email address"
                      className="w-full placeholder:text-gray-600 pl-3 p-[6px] bg-white border border-borderColor rounded-r-lg"
                      value={user.data.email}
                      type="email"
                      name="billFromEmail"
                      disabled
                    />
                  </div>
                  <div className="flex flex-row group">
                    <div className="items-center justify-center flex bg-gray-100 border rounded-l-lg p-1 font-medium">
                      <BiSolidPhone />
                    </div>
                    <input
                      placeholder="Contact"
                      className="w-full placeholder:text-gray-600 pl-3 p-[6px] border border-borderColor bg-white rounded-r-lg"
                      value={user.data.contact}
                      type="tel"
                      name="billFromContact"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <InvoiceItem
                onItemizedItemEdit={onItemizedItemEdit}
                onRowAdd={handleAddEvent}
                onRowDel={handleRowDelete}
                currency={localUser.currency}
                items={invoice.items}
              />
              <div className="flex justify-end mt-4">
                <div className="col-lg-6">
                  <div className="flex flex-row items-start justify-between gap-16">
                    <span className="font-bold">Subtotal: </span>
                    <span>
                      {localUser.currency}
                      {localUser.subTotal}
                    </span>
                  </div>
                  <div className="flex flex-row items-start justify-between mt-2 gap-16">
                    <span className="font-bold">Discount:</span>
                    <span>
                      <span className='mr-2'>({localUser.discountRate || 0}%)</span>
                      {localUser.currency}
                      {localUser.discountAmount}
                    </span>
                  </div>
                  <div className="flex flex-row items-start justify-between mt-2 gap-16">
                    <span className="font-bold">Tax:</span>
                    <span>
                      <span className='mr-2'>({localUser.taxRate}%)</span>
                      {localUser.currency}
                      {localUser.taxAmount}
                    </span>
                  </div>
                  <hr />
                  <div className="flex text-lg flex-row items-start justify-between gap-16">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">
                      {localUser.currency}
                      {localUser.total}
                    </span>
                  </div>
                </div>
              </div>
              <hr className="my-4" />
              <label className="font-bold">Notes:</label>
              <textarea
                placeholder="Thanks for your business!"
                name="notes"
                value={localUser.notes}
                onChange={(event) => editField(event)}
                className="my-2 block w-full placeholder:text-gray-600 bg-borderColor rounded-sm p-2"
                rows={2}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="flex flex-col col-md-4 col-lg-2">
            <div className="fixed w-1/6">
              <button
                type="submit"
                className={`${!edit && "bg-primaryColor/40 cursor-not-allowed hover:bg-primaryColor/40"} block w-full bg-primaryColor hover:bg-hoverColor text-lg text-white tracking-wider py-2 rounded-lg`} disabled={!edit}
              >
                Review Invoice
              </button>
              <div className="mt-3 mb-3 w-full flex flex-col group">
                <label className="font-bold">Currency: </label>
                <select
                  onChange={(event) => onCurrencyChange(event.target.value)}
                  className={`${!edit && "hidden"} bg-borderColor p-2 rounded-lg items-center my-1 border border-borderColor`}
                  aria-label="Change Currency"
                >
                  <option value="₹">INR (Indian Rupees)</option>
                  <option value="$">USD (United States Dollar)</option>
                  <option value="£">GBP (British Pound Sterling)</option>
                  <option value="¥">JPY (Japanese Yen)</option>
                  <option value="₿">BTC (Bitcoin)</option>
                </select>
                <span className={`${edit && "hidden"} bg-gray-200 p-1 flex justify-center rounded-lg text-lg`}>{localUser.currency}</span>
              </div>
              <div className="my-3">
                <label className="font-bold">Tax rate:</label>
                <div className="my-1 flex flex-nowrap group">
                  <input
                    name="taxRate"
                    type="number"
                    value={invoice.taxRate}
                    onChange={(event) => editField(event)}
                    className="w-[90%] p-2 bg-borderColor border border-r-0 border-borderColor rounded-l-md"
                    placeholder="0.0"
                    min="0.00"
                    step="0.01"
                    max="100.00"
                  />
                  <span className="bg-gray-200 w-[11%] border rounded-r-md border-borderColor p-1 font-bold text-black flex items-center justify-center">
                    %
                  </span>
                </div>
              </div>
              <div className="my-3">
                <label className="font-bold">Discount rate:</label>
                <div className="my-1 flex flex-nowrap group">
                  <input
                    className="w-[90%] p-2 bg-borderColor border border-r-0 border-borderColor rounded-l-md"
                    type="number"
                    name="discountRate"
                    value={invoice.discountRate}
                    onChange={(event) => editField(event)}
                    placeholder="0.0"
                    min="0.00"
                    step="0.01"
                    max="100.00"
                  />
                  <span className="bg-gray-200 w-[11%] border rounded-r-md border-borderColor p-1 font-bold text-secondary flex items-center justify-center text-black">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    {isOpen && (
      <div className="w-full h-full bg-[#0000007F] z-10 top-0 right-0 left-0 bottom-0 fixed items-center justify-center flex overflow-y-scroll scrollbar-none pt-24">
        <ShowModal
          closeModal={closeModal}
          localUser={localUser}
          items={localUser.items}
          user={user}
        />
      </div>
    )}
  </>
  );
};

export default ShowInvoice;
