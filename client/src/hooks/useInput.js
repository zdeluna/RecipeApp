import React, { useState } from "react";

export const useInput = ({ type, initialValue }) => {
    const [value, setValue] = useState(initialValue);
    const input = (
        <input
            key={"inputbox" + { initialValue }}
            defaultValue={initialValue}
            onChange={e => setValue(e.target.value)}
            type={type}
        />
    );
    return [value, setValue, input];
};
