import { forwardRef } from "react";
import Select from "react-select";

const Dropdown = forwardRef((props) => {
  return (
    <Select
      classNames={{
        input: () => "!bg-wagmi-black !text-white",
        menu: () => "bg-slate-900 !text-white",
        option: () =>
          "!bg-wagmi-black !text-white rounded-md border border-wagmi-gray !text-white focus:!bg-white",
        dropdownIndicator: () => "!bg-wagmi-black !text-white",
        menuList: () => "!bg-wagmi-black !text-white rounded-md",
        menuPortal: () => "!bg-wagmi-black !text-white rounded-md",
        clearIndicator: () => "!bg-wagmi-black !text-white rounded-md",
        container: () => "!bg-wagmi-black !text-white rounded-md",
        control: () => "!bg-wagmi-black !text-white rounded-md",
        group: () => "!bg-wagmi-black !text-white rounded-md",
        groupHeading: () => "!bg-wagmi-black !text-white rounded-md",
        indicatorsContainer: () => "!bg-wagmi-black !text-white rounded-md",
        indicatorSeparator: () => "!bg-wagmi-black !text-white rounded-md",
        loadingIndicator: () => "!bg-wagmi-black !text-white rounded-md",
        loadingMessage: () => "!bg-wagmi-black !text-white rounded-md",
        multiValue: () => "!bg-wagmi-black !text-white rounded-md",
        multiValueLabel: () => "!bg-wagmi-black !text-white rounded-md",
        multiValueRemove: () => "!bg-wagmi-black !text-white rounded-md",
        noOptionsMessage: () => "!bg-wagmi-black !text-white rounded-md",
        placeholder: () => "!bg-wagmi-black !text-white rounded-md text-white",
        singleValue: () => "!bg-wagmi-black !text-white z-10 rounded-md",
        valueContainer: () => "!bg-wagmi-black !text-white rounded-md",
      }}
      {...props}
    />
  );
});

Dropdown.displayName = "Dropdown";

export default Dropdown;
