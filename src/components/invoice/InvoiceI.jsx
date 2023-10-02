import React, { useState } from "react";
import ItemR from "./ItemR";

function InvoiceI(props) {
    const [itemsData, setItemsData] = useState(props?.itemsData);
    var onItemizedItemEdit = props.onItemizedItemEdit;
    var currency = props.currency;
    var rowDel = props.onRowDel;
    var edit = props?.edit;
    var itemTable = props.itemsData?.map(function(item, index){
        return (
            <ItemR 
            onItemizedItemEdit={onItemizedItemEdit}
            item={item}
            onDelEvent={rowDel}
            key={item.id}
            index={index+1}
            currency={currency}
            edit={edit}
            />
        )
    }
    );
    return (
        <div>
        <table>
          <thead>
            <tr className='border-t-2 border-b-2 border-gray-200'>
              <th className="py-2">No.</th>
              <th className="text-center">ITEM</th>
              <th>QTY</th>
              <th>PRICE/RATE</th>
              <th className="text-center">ACTION</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-1"></td>
            </tr>
            {itemTable}
            <tr>
              <td className="py-1"></td>
            </tr>
          </tbody>
        </table>  
        <button className="bg-primaryColor p-2 px-3 font-medium text-md text-white mt-2 rounded-lg hover:bg-hoverColor" onClick={props.onRowAdd} disabled={!edit}>
          Add Item
        </button>
      </div>
    );
}

export default InvoiceI;