import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState, useRef } from "react";

const dropdown = {
    width: "300px"
}

export const dropdownOptionTemplate = (option) => {
    return (
        <div className="dropdown-item" style={dropdown} >
            <div className="wrapper-small" title={option.label}>
                {option.label}
            </div>
        </div>
    );
};

export default function FilterTemplate({ ref }) {
    const [filterValue, setFilterValue] = useState("");
    ref = useRef();
    const dropdownFilterTemplate = (options) => {
        let { filterOptions } = options;
        return (
            <div className="p-multiselect-filter-container">
                <InputText
                    className="p-inputtext p-component p-multiselect-filter"
                    value={filterValue}
                    ref={ref}
                    onChange={(e) => {
                        myFilterFunction(e, filterOptions);
                    }}
                />
            </div>
        );
    };

    const myFilterFunction = (event, options) => {
        let _filterValue = event.target.value;
        setFilterValue(_filterValue);
        options.filter(event);
    };

    return dropdownFilterTemplate;
}

