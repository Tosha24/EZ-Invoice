import React from "react";
import clsx from "clsx";

// props: onItemizedItemEdit, cellData, disabled

const EditableF = (props) => {
    return (
        <div className="my-1 flex flex-nowrap group">
        {
          props.cellData.leading != null &&
          <div
            className="bg-borderColor font-bold border-0 rounded-l-lg text-secondary px-2 flex items-center justify-center">
            <span className="border border-secondary rounded-circle d-flex align-items-center justify-content-center small w-5 h-5">
              {props.cellData.leading}
            </span>
          </div>
        }
        <input
          className={clsx(`w-full border p-2 text-md rounded-lg`,
          `${props.cellData.textAlign}`,
          props.cellData.leading != null && "rounded-none rounded-r-lg")}
          type={props.cellData.type}
          placeholder={props.cellData.placeholder}
          min={props.cellData.min}
          name={props.cellData.name}
          id={props.cellData.id}
          value={props.cellData.value}
          step={props.cellData.step}
          presicion={props.cellData.presicion}
          aria-label={props.cellData.name}
          onChange={props.onItemizedItemEdit}
          autoComplete="off"
          maxLength={props.cellData.maxLength}
          required={props.cellData.required}
          disabled={props.disabled}
        />
      </div>
    )
}

export default EditableF;