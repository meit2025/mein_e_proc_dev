import * as React from "react"
import { ScrollArea } from "../shacdn/scroll-area";


export interface multiSelectItemInterface {
   
    isSelect: boolean

}
export function MultiSelectItem ({

    children,
    isSelect,
    
    
}:React.PropsWithChildren<multiSelectItemInterface>) {
    return <div className={'py-2 ' + (isSelect ? 'bg-gray-200 ' : '')}>{children ? children : null} {isSelect? 'true' : 'false'}</div>;
}


export interface multiSelectInterface {
    options : any[],
    label: string,
    key:string,
    value: any[],
    onSelect: (value:any) => void
 }
export function MultiSelect({
    options,
    label,
    key,
    onSelect,
    value
}: multiSelectInterface) {
    const [itemSelect, setItemSelect] = React.useState<any>(null);

    const [rightValues, setRightValues] = React.useState<any[]>([]);
    const [leftValues, setLeftValues] = React.useState<any[]>([]);

    const leftItems =  options.filter((filter) => !value.includes(filter[key]));
    const rightItems =  value.filter((filter) => !options.map((map) => map[key]).includes(filter));

    // console.log(leftItems)

    function selectItemHandler(item:any) {
        setItemSelect(item);

        console.log(itemSelect)
    }

    function setToRightValue() {
        
        setRightValues([
            ...rightValues,
            itemSelect
        ])

        setItemSelect(null)
      
    }

    function setLeftValue() {
      setLeftValues([...leftValues, itemSelect]);
      setItemSelect(null);
    }

    function updateValues() {
        setLeftValues(leftValues.filter((item) => !rightValues.map((map)=> map[key]).includes(item[key])));
        setRightValues(
          rightValues.filter((item) => !leftValues.map((map) => map[key]).includes(item[key])),
        );

      

    }

    React.useEffect(() => {
        updateValues()
    }, [setRightValues, setLeftValues]);

    React.useEffect(() => {
      setLeftValues(options.filter((filter) => !value.includes(filter[key])));
      setRightValues(value)
    }, [options, value]);
     return (
       <div className='flex items-center space-x-4'>
         <div className='flex-1'>
           <ScrollArea className='h-[300px] w-full bg-white border rounded-lg'>
             {leftValues.map((item) => (
               <div
                 onClick={() => {
                   selectItemHandler(item);
                 }}
               >
                 <MultiSelectItem isSelect={itemSelect ? item[key] == itemSelect[key] : false}>
                   {item[label]} {item[key]}
                 </MultiSelectItem>
               </div>
             ))}
           </ScrollArea>
         </div>
         <div className='multi-select-button w-8'>
           <ul className='flex flex-col space-y-4 items-center'>
             <li onClick={() => setToRightValue()}>{'>>'}</li>
             <li onClick={() => setLeftValue()}>{'<<'}</li>
           </ul>
         </div>

         <div className='flex-1'>
           <ScrollArea className='h-[300px] w-full bg-white border rounded-lg'>
             {rightValues.map((item) => (
               <div
                 onClick={() => {
                   selectItemHandler(item);
                 }}
               >
                 <MultiSelectItem isSelect={itemSelect ? item[key] == itemSelect[key] : false}>
                   {item[label]} {item[key]}
                 </MultiSelectItem>

                 {item[label]}
               </div>
             ))}
           </ScrollArea>
         </div>
       </div>
     );
}