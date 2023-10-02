import React from "react";
import { BiTrash } from "react-icons/bi";
import EditableF from "./EditableF";

// props: onItemizedItemEdit, item, onDelEvent, key, index, currency, edit

const ItemR = (props) => {
    const onDelEvent = () => {
        props.onDelEvent(props.item);
    }

    const edit = props?.edit;
    const currency = props?.currency;

    return (
        <>
        <tr>
          <td className='w-8'>
            {props.index}.
          </td>
          <td className="w-full pr-2">
            <EditableF
              onItemizedItemEdit={props.onItemizedItemEdit}
              cellData={{
                type: "text",
                name: "name",
                placeholder: "Item name",
                value: props.item.name,
                id: props.item.id,
              }}
              disabled={!edit}
            />
          </td>
          <td className="min-w-[70px] pr-1">
            <EditableF
              onItemizedItemEdit={props.onItemizedItemEdit}
              cellData={{
                type: "number",
                name: "quantity",
                min: 1,
                step: "1",
                value: props.item.quantity,
                id: props.item.id,
              }}
              disabled={!edit}
            />
          </td>
          <td className="min-w-xs pr-1">
            <EditableF
              onItemizedItemEdit={props.onItemizedItemEdit}
              cellData={{
                leading: currency,
                type: "number",
                name: "price",
                min: 0,
                step: "0.1",
                presicion: 2,
                textAlign: "text-end",
                value: props.item.price,
                id: props.item.id,
                required: true,
              }}
              disabled={!edit}
            />
          </td>
          <td className="text-center w-12">
            <BiTrash
              onClick={onDelEvent.bind(this)}
              className="h-8 w-8 p-2 mx-auto text-white mt-1 bg-red-600 rounded-lg cursor-pointer hover:-translate-y-1 duration-300"
            />
          </td>
        </tr>
        <tr className='border-b border-gray-300'>
          <td></td>
          <td className="w-full pr-2">
            <EditableF
              onItemizedItemEdit={props.onItemizedItemEdit}
              cellData={{
                type: "text",
                name: "description",
                placeholder: "Item description",
                value: props.item.description,
                id: props.item.id,
                maxLength: 80,
                required: false,
              }}
              disabled={!edit}
            />
          </td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </>
    )
}

export default ItemR;