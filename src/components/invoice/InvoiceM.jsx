import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BiCloudDownload } from "react-icons/bi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { format } from "date-fns";
import { RiSave3Fill } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";

// props: showModal, closeModal, invoiceData, userData, itemsData, edit, save

const InvoiceM = (props) => {
    const [userData, setUserData] = useState(props.userData);
    const [invoiceData, setInvoiceData] = useState(props.invoiceData);
    const [itemsData, setItemsData] = useState(props.itemsData);

    const edit = props.edit;
    const save = props.save;

    const GenerateInvoice = () => {
        html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
            const imgData = canvas.toDataURL("image/png", 1.0);
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "pt",
                format: [612, 792],
            });

            pdf.internal.scaleFactor = 1;
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${invoiceData.customerName}-invoice.pdf`);
        }).then(() => {
            props.closeModal();
        });
    };

    const SaveInvoice = async() => {
        try{
            const response = await axios.post('/api/invoices/invoice', invoiceData);
            console.log(response);
            toast.success("Invoice Saved Successfully");
            props.closeModal();
            window.location.reload();
        }catch(error){
            console.log(error);
            toast.error("Error while saving invoice!! Please try again later.");
        }
    }

    // const formattedDate = format(new Date(invoiceData.issueDate), "dd-MM-yyyy");

    return (
        <div className="bg-white w-4/5 min-h-[40%] items-center justify-center">
        <div id="invoiceCapture">
          <div>
            <div className="flex flex-row justify-between items-start w-100 px-4 bg-gray-400">
              <div className="w-100">
                <h4 className="fw-bold my-2 text-5xl text-black">
                  {" "}
                  {userData.companyName}
                </h4>
                <div className='flex flex-row gap-10'>
                  <h6 className="fw-bold text-secondary text-black">
                    Invoice : {invoiceData.invoiceNumber || ""}
                  </h6>
                  <h6 className='fw-bold text-secondary text-black'>Due Date:&nbsp;{invoiceData.dueDate || ""}</h6>
                </div>
              </div>
              <div className="text-end p-4">
                <h6 className="fw-bold mt-1 mb-2 text-black">
                  Amount&nbsp;Due:
                </h6>
                <h5 className="fw-bold text-secondary text-black text-3xl mt-2">
                  {" "}
                  {invoiceData.currency}&nbsp;{invoiceData.totalAmount}
                </h5>
              </div>
            </div>
            <div className="p-4">
              <div className="mb-4 flex flex-row">
                <div className="flex flex-col cols-md-4 w-full">
                  <div className="fw-bold">Billed to:</div>
                  <div className='font-medium text-lg'>{invoiceData.customerName || ""}</div>
                  <div>{invoiceData.customerAddress || ""},</div>
                  <div>{invoiceData.customerCity || ""},</div>
                  <div>{invoiceData.customerState || ""}.</div>
                  <div className='flex flex-row mt-1'><span className='font-medium'>Email</span>:&nbsp;<span>{invoiceData.customerEmail || ""}</span></div>
                  <div className='flex flex-row'><span className='font-medium'>Contact</span>:&nbsp;<span>{invoiceData.customerContact || ""}</span></div>
                </div>
                <div className="flex flex-col cols-md-4 w-full">
                  <div className="fw-bold">Billed From:</div>
                  <div className='font-medium text-lg'>{userData.companyName || ""}</div>
                  <div>{userData.address || ""},</div>
                  <div>{userData.city || ""},</div>
                  <div>{userData.state || ""}.</div>
                  <div className='flex flex-row mt-1'><span className='font-medium'>Email</span>:&nbsp;<span> {userData.email || ""}</span></div>
                  <div className='flex flex-row'><span className='font-medium'>Contact</span>:&nbsp;<span> {userData.contact || ""}</span></div>
                </div> 
              </div>
              <table className="mb-0 w-full border border-collapse">
                <thead>
                  <tr className='border-b-2 '>
                    <th>No.</th>
                    <th className="border-l-2 border-r-2 text-justify p-2">DESCRIPTION</th>
                    <th className="text-center p-2">QTY</th>
                    <th className="border-l-2 text-center p-2">PRICE</th>
                    <th className="border-l-2 text-center p-2">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsData.map((item, i) => {
                    return (
                      <tr id={i} key={i} className="border-b-2 h-9">
                        <td className=" text-center h-7">{i+1}</td>
                        <td className='break-all border-l-2 border-r-2 pl-2 pr-4 pb-2'>
                          <span className='font-bold'>{item.name}</span> <br/> <span className='text-sm'>{item.description}</span>
                        </td>
                        <td className="text-center w-16">{item.quantity}</td>
                        <td className="border-l-2 text-center w-24">
                          {invoiceData.currency} {item.price}
                        </td>
                        <td className="border-l-2 text-center w-24">
                          {invoiceData.currency} {item.price * item.quantity}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold pr-2 w-24">
                      SUBTOTAL
                    </td>
                    <td className="text-end min-w-fit">
                      {invoiceData.currency} {invoiceData.subTotal}
                    </td>
                  </tr>
                  {invoiceData.taxAmount != 0.0 && (
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold pr-2 w-24">
                        TAX
                      </td>
                      <td className="text-end min-w-fit">
                        ({invoiceData.taxRate}%)&nbsp;{invoiceData.currency}&nbsp;{invoiceData.taxAmount}
                      </td>
                    </tr>
                  )}
                  {invoiceData.discountAmount != 0.0 && (
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold border-b-2 pb-2 pr-2 w-24">
                        DISCOUNT
                      </td>
                      <td className="text-end border-b-2 pb-2 min-w-fit">
                        ({invoiceData.discountRate}%)&nbsp;{invoiceData.currency}&nbsp;{invoiceData.discountAmount}
                      </td>
                    </tr>
                  )}
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold pr-2 w-24">
                      TOTAL
                    </td>
                    <td className="text-end w-48">
                      {invoiceData.currency} {invoiceData.totalAmount}
                    </td>
                  </tr>
                </tbody>
              </table>
              {invoiceData.notes && (
                <div className="bg-light py-3 px-4 mt-4 rounded">
                  Note:&nbsp;{invoiceData.notes}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="pb-4 px-4 mt-6">
            <div className="flex flex-row items-center justify-center gap-3">
              <button
                className="flex max-w-fit mt-3 mt-md-0 bg-primaryColor items-center px-4 p-2 rounded-lg text-white hover:-translate-y-2 duration-300"
                onClick={props.closeModal}
              >
                <FaPencilAlt className="mr-2 mt-[-3px]" />
                Edit Invoice
              </button>
              <button
                className="flex max-w-fit mt-3 mt-md-0 bg-primaryColor items-center px-4 p-2 rounded-lg text-white hover:-translate-y-2 duration-300"
                onClick={GenerateInvoice}
              >
                <BiCloudDownload className="mr-2 mt-[-3px]" />
                Download Copy
              </button>
              <button
                className={`${!save && "hidden"} flex max-w-fit mt-3 mt-md-0 bg-primaryColor items-center px-4 p-2 rounded-lg text-white hover:-translate-y-2 duration-300`} onClick={SaveInvoice}
              >
                <RiSave3Fill className="mr-2 mt-[-3px]" />
                Save Invoice
              </button>
            </div>
        </div>
        <hr className="mt-4 mb-3" />
      </div>
    )
}

export default InvoiceM;