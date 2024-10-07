import * as React from "react"

export function MultiSelectItem () {
    return (
        <div>
            
        </div>
    )
}

export function MultiSelect() {
    const [itemSelect, setItemSelect] = React.useState("");
    return (
        <div className="flex items-center space-x-4">   
            <div className="flex-1">

            </div>
            <div className="multi-select-button w-32">
                <ul className="flex flex-col items-center">
                    <li>
                        {'>>'}
                    </li>
                    <li>
                        {'<<'}
                    </li>
                </ul>
            </div>

              <div className="flex-1">

            </div>
        </div>
    )
}