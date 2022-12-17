import type { ComponentProps } from "react";
import { forwardRef, useId } from "react";

import { FieldError } from "@components/Form";

interface Props extends ComponentProps<"textarea"> {
  label?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  function TextArea({ label, ...props }, ref) {
    const id = useId();

    return (
      <label htmlFor={id}>
        {label && <div className="label">{label}</div>}
        <textarea id={id} className="input w-full" ref={ref} {...props} />
        {props.name && <FieldError name={props.name} />}
      </label>
    );
  }
);
