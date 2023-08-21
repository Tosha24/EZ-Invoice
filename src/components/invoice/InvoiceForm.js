import React from "react";
import InvoiceItem from "./InvoiceItem";
import InvoiceModal from "./InvoiceModal.js";
import moment from "moment";
import Loading from "@/components/Loading";
import { BiSolidPhone } from 'react-icons/bi';

class InvoiceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      currency: this.props?.invoice?.currency || "₹",
      currentDate: this.props?.invoice?.dateOfIssue || "",
      invoiceNumber: this.props?.invoice?.invoiceNumber || 1,
      dateOfIssue: this.props?.invoice?.dueDate || "",
      billTo: this.props?.invoice?.customerName || "",
      gstin: this.props?.invoice?.customerGstin || "",
      billToEmail: this.props?.invoice?.customerEmail || "",
      billToAddress: this.props?.invoice?.customerAddress || "",
      billToCity: this.props?.invoice?.customerCity || "",
      billToState: this.props?.invoice?.customerState || "",
      billToContact: this.props?.invoice?.customerContact || String(""),
      notes: this.props?.invoice?.notes || "",
      total: this.props?.invoice?.totalAmount || "0.00",
      subTotal: this.props?.invoice?.subTotal || "0.00",
      taxRate: this.props?.invoice?.taxRate || "",
      taxAmmount: this.props?.invoice?.taxAmount || "0.00",
      discountRate: this.props?.invoice?.discountRate || "",
      discountAmmount: this.props?.invoice?.discountAmount || "0.00",
      status: this.props?.invoice?.status || "Unpaid",
      isLoading: false,
    };
    this.state.items = [
      {
        id: 0,
        name: this.props?.invoice?.items[0]?.name || "",
        description: this.props?.invoice?.items[0]?.description || "",
        price: this.props?.invoice?.items[0]?.price || "0.00",
        quantity: this.props?.invoice?.items[0]?.quantity || 1,
      },
    ];
    this.editField = this.editField.bind(this);
  }
  componentDidMount(prevProps) {
    this.handleCalculateTotal();
  }
  handleRowDel(items) {
    var index = this.state.items.indexOf(items);
    this.state.items.splice(index, 1);
    this.setState(this.state.items);
    this.handleCalculateTotal();
  }

  handleAddEvent(evt) {
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    var items = {
      id: id,
      name: "",
      price: "0.00",
      description: "",
      quantity: 1,
    };
    this.state.items.push(items);
    this.setState(this.state.items);
    this.handleCalculateTotal();
  }
  handleCalculateTotal() {
    var items = this.state.items;
    var subTotal = 0;

    items.forEach((item) => {
      subTotal = parseFloat(
        parseFloat(subTotal) +
          parseFloat(item.price).toFixed(2) * parseInt(item.quantity)
      ).toFixed(2);
    });

    this.setState(
      {
        subTotal: parseFloat(subTotal).toFixed(2),
      },
      () => {
        this.setState(
          {
            taxAmmount: parseFloat(
              parseFloat(subTotal) * (this.state.taxRate / 100)
            ).toFixed(2),
          },
          () => {
            this.setState(
              {
                discountAmmount: parseFloat(
                  parseFloat(subTotal) * (this.state.discountRate / 100)
                ).toFixed(2),
              },
              () => {
                this.setState({
                  total:
                    subTotal -
                    this.state.discountAmmount +
                    parseFloat(this.state.taxAmmount),
                });
              }
            );
          }
        );
      }
    );
  }
  onItemizedItemEdit(evt) {
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value,
    };

    var items = this.props?.invoice?.items.slice() || this.state.items.slice();
    var newItems = items.map(function (items) {
      for (var key in items) {
        if (key == item.name && items.id == item.id) {
          items[key] = item.value;
        }
      }
      return items;
    });
    this.setState({ items: newItems });
    this.handleCalculateTotal();
  }
  editField = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
    this.handleCalculateTotal();
  };
  onCurrencyChange = (selectedOption) => {
    this.setState(selectedOption);
  };

  onStatusChange = (selectedOption) => {
    this.setState(selectedOption);
  } 

  openModal = (event) => {
    event.preventDefault();
    this.handleCalculateTotal();
    this.setState({ isOpen: true });
  };
  closeModal = (event) => this.setState({ isOpen: false });

  render() {
    const user = this.props.user;
    return (
      <>
        {this.state.isLoading ? (
          <Loading />
        ) : (
          <div>
            <form onSubmit={this.openModal}>
              <div className="flex flex-row gap-4 items-start justify-center">
                <div className="flex flex-col col-md-6 col-lg-9">
                  <div className="border border-gray-200 rounded-lg p-4 p-xl-5 my-3 my-xl-4">
                    <div className="flex flex-row items-start justify-between mb-3">
                      <div className="flex flex-col">
                        <div className="flex flex-col">
                          <div className="mb-2">
                            <span className="font-bold">Current Date: </span>
                            <span>{this.state.currentDate = moment().format("DD-MM-YYYY")}</span>
                          </div>
                        </div>
                        <div className="flex flex-row items-center">
                          <span className="font-bold block mr-2">
                            Due Date:{" "}
                          </span>
                          <input
                            type="date"
                            value={this.state.dateOfIssue}
                            name="dateOfIssue"
                            onChange={(event) => this.editField(event)}
                            className={`${!this.props?.edit && "hidden"} max-w-[150px] pl-4 p-[6px] rounded-lg bg-borderColor border`}
                            required
                          />
                          <span className={`${this.props?.edit && "hidden"}`}>{this.state.dateOfIssue}</span>
                        </div>
                      </div>
                      <div className='flex flex-col gap-2'>
                      <div className="flex flex-row items-center">
                        <span className="font-bold me-2">Invoice Number: </span>
                        <input
                          type="number"
                          className="max-w-[70px] bg-borderColor p-[6px] rounded-lg pl-3 border"
                          value={this.state.invoiceNumber}
                          name="invoiceNumber"
                          onChange={(event) => this.editField(event)}
                          min="1"
                          required
                          disabled={!this.props?.edit}
                        />
                      </div>
                      <div className='flex flex-row items-center'>
                        <span className='font-bold me-2'>Status: </span>
                        <select className='border p-1 rounded-lg bg-borderColor px-3'
                        onChange={(event) =>
                          this.onStatusChange({
                            status: event.target.value,
                          })
                        } disabled={!this.props?.edit}>
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
                          className="w-full placeholder:text-gray-600 pl-3 p-[6px] border bg-borderColor rounded-lg"
                          value={this.state.billTo}
                          type="text"
                          name="billTo"
                          onChange={(event) => this.editField(event)}
                          autoComplete="off"
                          required
                          disabled={!this.props?.edit}
                        />
                        <input
                          placeholder="GSTIN"
                          className="w-full placeholder:text-gray-600 pl-3 p-[6px] border bg-borderColor rounded-lg uppercase"
                          value={this.state.gstin}
                          type="text"
                          name="gstin"
                          onChange={(event) => this.editField(event)}
                          autoComplete="off"
                          maxLength={15}
                          required
                          disabled={!this.props?.edit}
                        />
                        
                        <input
                          placeholder="Address Line 1"
                          className="w-full placeholder:text-gray-600 pl-3 p-[6px] border bg-borderColor rounded-lg"
                          value={this.state.billToAddress}
                          type="text"
                          name="billToAddress"
                          onChange={(event) => this.editField(event)}
                          autoComplete="off"
                          maxLength={50}
                          required
                          disabled={!this.props?.edit}
                        />
                        <input
                          placeholder="City"
                          className="w-full placeholder:text-gray-600 pl-3 p-[6px] border bg-borderColor rounded-lg"
                          value={this.state.billToCity}
                          type="text"
                          name="billToCity"
                          onChange={(event) => this.editField(event)}
                          autoComplete="off"
                          required
                          disabled={!this.props?.edit}
                        />
                        <input
                          placeholder="State"
                          className="w-full placeholder:text-gray-600 pl-3 p-[6px] border bg-borderColor rounded-lg"
                          value={this.state.billToState}
                          type="text"
                          name="billToState"
                          onChange={(event) => this.editField(event)}
                          autoComplete="off"
                          required
                          disabled={!this.props?.edit}
                        />
                        <div className='flex flex-row group'>
                          <div className='flex items-center justify-center p-1 rounded-l-lg border bg-gray-100 font-semibold'>@</div>
                          <input
                            placeholder="Email address"
                            className="w-full placeholder:text-gray-600 pl-3 p-[6px] border bg-borderColor rounded-r-lg"
                            value={this.state.billToEmail}
                            type="email"
                            name="billToEmail"
                            onChange={(event) => this.editField(event)}
                            autoComplete="off"
                            required
                            disabled={!this.props?.edit}
                          />
                        </div>
                        <div className="flex flex-row group">
                          <div className="items-center justify-center flex bg-gray-100 border rounded-l-lg p-1 font-medium">
                            <BiSolidPhone/>
                          </div>
                          <input
                            placeholder="Contact"
                            className="w-full placeholder:text-gray-600 pl-3 p-[6px] border bg-borderColor rounded-r-lg"
                            value={this.state.billToContact}
                            type="tel"
                            name="billToContact"
                            onChange={(event) => this.editField(event)}
                            maxLength={10}
                            autoComplete="off"
                            required
                            disabled={!this.props?.edit}
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
                        <div className='flex flex-row group'>
                          <div className='flex items-center justify-center p-1 rounded-l-lg border bg-gray-100 font-semibold'>@</div>
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
                            <BiSolidPhone/>
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
                      onItemizedItemEdit={this.onItemizedItemEdit.bind(this)}
                      onRowAdd={this.handleAddEvent.bind(this)}
                      onRowDel={this.handleRowDel.bind(this)}
                      currency={this.state.currency}
                      items={this.state.items}
                      edit={this.props?.edit}
                    />
                    <div className="flex flex-end mt-4 justify-content-end">
                      <div className="col-lg-6">
                        <div className="flex flex-row items-start justify-between">
                          <span className="font-bold">Subtotal: </span>
                          <span>
                            {this.state.currency}
                            {this.state.subTotal}
                          </span>
                        </div>
                        <div className="flex flex-row items-start justify-between mt-2">
                          <span className="font-bold">Discount:</span>
                          <span>
                            <span>({this.state.discountRate || 0}%)</span>
                            {this.state.currency}
                            {this.state.discountAmmount || 0}
                          </span>
                        </div>
                        <div className="flex flex-row items-start justify-between mt-2">
                          <span className="font-bold">Tax:</span>
                          <span>
                            <span>({this.state.taxRate || 0}%)</span>
                            {this.state.currency}
                            {this.state.taxAmmount || 0}
                          </span>
                        </div>
                        <hr />
                        <div className="flex font-xl flex-row items-start justify-between">
                          <span className="font-bold">Total:</span>
                          <span className="font-bold">
                            {this.state.currency}
                            {this.state.total || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    <hr className="my-4" />
                    <label className="font-bold">Notes:</label>
                    <textarea
                      placeholder="Thanks for your business!"
                      name="notes"
                      value={this.state.notes}
                      onChange={(event) => this.editField(event)}
                      className="my-2 block w-full placeholder:text-gray-600 bg-borderColor rounded-sm p-2"
                      rows="2"
                      autoComplete="off"
                      disabled={!this.props?.edit}
                    />
                  </div>
                </div>
                <div className="flex flex-col col-md-4 col-lg-2">
                  <div className="fixed pt-md-3 pt-xl-4">
                    <button
                      type="submit"
                      className={`${!this.props?.edit && "bg-primaryColor/40 hover:bg-primaryColor/40 cursor-not-allowed" } block w-full bg-primaryColor hover:bg-hoverColor text-lg text-white tracking-wider py-2 rounded-lg`}
                    >
                      Review Invoice
                    </button>
                    <div className="mt-3 mb-3 w-full flex flex-col group">
                      <label className="font-bold">Currency: </label>
                      <select
                        onChange={(event) =>
                          this.onCurrencyChange({
                            currency: event.target.value,
                          })
                        }
                        className="bg-borderColor p-2 rounded-lg items-center my-1 border border-borderColor"
                        aria-label="Change Currency"
                        disabled={!this.props?.edit}
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
                          value={this.state.taxRate}
                          onChange={(event) => this.editField(event)}
                          className="w-[90%] p-2 bg-white border border-r-0 border-borderColor rounded-l-md"
                          placeholder="0.0"
                          min="0.00"
                          step="0.01"
                          max="100.00"
                          disabled={!this.props?.edit}
                        />
                        <span className="bg-gray-50 w-[11%] border rounded-r-md border-borderColor p-1 font-bold text-gray-500 flex items-center justify-center">
                          %
                        </span>
                      </div>
                    </div>
                    <div className="my-3">
                      <label className="font-bold">Discount rate:</label>
                      <div className="my-1 flex flex-nowrap group">
                        <input
                          className="w-[90%] p-2 bg-white border border-r-0 border-borderColor rounded-l-md"
                          type="number"
                          name="discountRate"
                          value={this.state.discountRate}
                          onChange={(event) => this.editField(event)}
                          placeholder="0.0"
                          min="0.00"
                          step="0.01"
                          max="100.00"
                          disabled={!this.props?.edit}
                        />
                        <span className="bg-gray-50 w-[11%] border rounded-r-md border-borderColor p-1 font-bold text-secondary flex items-center justify-center">
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

        {this.state.isOpen && (
          <div className="w-full h-full bg-[#0000007F] z-30 top-0 right-0 left-0 bottom-0 fixed items-center justify-center flex overflow-y-scroll scrollbar-none pt-24">
            <InvoiceModal
              showModal={this.state.isOpen}
              closeModal={this.closeModal}
              info={this.state}
              items={this.state.items}
              currency={this.state.currency}
              subTotal={this.state.subTotal}
              taxAmmount={this.state.taxAmmount}
              discountAmmount={this.state.discountAmmount}
              taxRate={this.state.taxRate}
              discountRate={this.state.discountRate}
              total={this.state.total}
              user={user}
              edit={this.props?.edit}
              save={this.props.save}
            />
          </div>
        )}
      </>
    );
  }
}

export default InvoiceForm;