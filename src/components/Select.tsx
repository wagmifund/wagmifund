import { forwardRef } from "react";
import Select from "react-select";

const Dropdown = forwardRef((props) => {
  return (
    <Select
      classNames={{
        input: () => "!bg-slate-900 !text-white",
        menu: () => "bg-slate-900 !text-white",
        option: () =>
          "!bg-slate-900 !text-white rounded-md border border-theme !text-white focus:!bg-white",
        dropdownIndicator: () => "!bg-slate-900 !text-white",
        menuList: () => "!bg-slate-900 !text-white rounded-md",
        menuPortal: () => "!bg-slate-900 !text-white rounded-md",
        clearIndicator: () => "!bg-slate-900 !text-white rounded-md",
        container: () => "!bg-slate-900 !text-white rounded-md",
        control: () => "!bg-slate-900 !text-white rounded-md",
        group: () => "!bg-slate-900 !text-white rounded-md",
        groupHeading: () => "!bg-slate-900 !text-white rounded-md",
        indicatorsContainer: () => "!bg-slate-900 !text-white rounded-md",
        indicatorSeparator: () => "!bg-slate-900 !text-white rounded-md",
        loadingIndicator: () => "!bg-slate-900 !text-white rounded-md",
        loadingMessage: () => "!bg-slate-900 !text-white rounded-md",
        multiValue: () => "!bg-slate-900 !text-white rounded-md",
        multiValueLabel: () => "!bg-slate-900 !text-white rounded-md",
        multiValueRemove: () => "!bg-slate-900 !text-white rounded-md",
        noOptionsMessage: () => "!bg-slate-900 !text-white rounded-md",
        placeholder: () => "!bg-slate-900 !text-white rounded-md text-white",
        singleValue: () => "!bg-slate-900 !text-white z-10 rounded-md",
        valueContainer: () => "!bg-slate-900 !text-white rounded-md",
      }}
      {...props}
    />
  );
});

Dropdown.displayName = "Dropdown";

export default Dropdown;
