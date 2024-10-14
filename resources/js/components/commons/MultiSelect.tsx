import * as React from 'react';
import { ScrollArea } from '../shacdn/scroll-area';

export interface multiSelectItemInterface {
  isSelect: boolean;
  onClick: (e: any) => void;
}
export function MultiSelectItem({
  children,
  isSelect,
  onClick,
}: React.PropsWithChildren<multiSelectItemInterface>) {
  return (
    <div onClick={onClick} className={'py-2 ' + (isSelect ? 'bg-gray-200 ' : '')}>
      {children ? children : null} {isSelect ? 'true' : 'false'}
    </div>
  );
}

export interface multiSelectInterface {
  options: any[];
  label: string;
  id: string;
  value: any[];
  onSelect: (value: any) => void;
}
export function MultiSelect({ options, label, id, onSelect, value }: multiSelectInterface) {
  const [itemSelect, setItemSelect] = React.useState([]);
  const [rightSelect, setRightSelect] = React.useState([]);

  const [rightValues, setRightValues] = React.useState<any[]>([]);
  const [leftValues, setLeftValues] = React.useState<any[]>([]);

  // console.log(leftItems)

  function selectItemHandler(e: any, item: any) {
    console.log(item.id);

    e.stopPropagation();
    // this is to stop click propagation to the native document click
    // listener in Menu.js
    e.nativeEvent.stopImmediatePropagation();

    if (itemSelect.find((find: any) => find[id] == item[id])) {
      const filteredItem = itemSelect.filter((filter: any) => filter[id] != item[id]);
      console.log(filteredItem);
      setItemSelect(filteredItem);
    } else {
      setItemSelect((itemSelect) => [...itemSelect, item]);
    }
  }

  function rightSelectHandler(e: any, item: any) {
    console.log(item.id);

    e.stopPropagation();
    // this is to stop click propagation to the native document click
    // listener in Menu.js
    e.nativeEvent.stopImmediatePropagation();

    if (rightSelect.find((find: any) => find[id] == item[id])) {
      const filteredItem = rightSelect.filter((filter: any) => filter[id] != item[id]);

      setRightSelect(filteredItem);
    } else {
      setRightSelect((rightSelect) => [...rightSelect, item]);
    }
  }

  function setToRightValue() {
    setRightValues([...rightValues, ...itemSelect]);

    setLeftValues(
      leftValues.filter((item) => !itemSelect.map((map) => map[id]).includes(item[id])),
    );

    setItemSelect([]);

    console.log(rightValues);
   
  }

  function setToLeftValue() {
    setLeftValues([...leftValues, ...rightSelect]);

    setRightValues(
      rightValues.filter((item) => !rightSelect.map((map) => map[id]).includes(item[id])),
    );

    setRightSelect([]);
  }


  console.log(rightValues)
  React.useEffect(() => {
     onSelect(rightValues);
  }, [rightValues])

  React.useEffect(() => {
    setLeftValues(options.filter((filter) => !value.includes(filter[id])));
    setRightValues(options.filter((filter) => value.includes(filter[id])));
  }, [options, value]);
  return (
    <div className='flex items-center space-x-4'>
      <div className='flex-1'>
        <ScrollArea className='h-[300px] w-full bg-white border rounded-lg'>
          {leftValues.map((item) => (
            <div key={item[id]}>
              <MultiSelectItem
                onClick={(e) => {
                  selectItemHandler(e, item);
                }}
                isSelect={itemSelect.find((find: any) => find[id] == item[id]) ? true : false}
              >
                {item[label]}
              </MultiSelectItem>
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className='multi-select-button w-8'>
        <ul className='flex flex-col space-y-4 items-center'>
          <li onClick={() => setToRightValue()}>{'>>'}</li>
          <li onClick={() => setToLeftValue()}>{'<<'}</li>
        </ul>
      </div>

      <div className='flex-1'>
        <ScrollArea className='h-[300px] w-full bg-white border rounded-lg'>
          {rightValues.map((item) => (
            <MultiSelectItem
              onClick={(e) => {
                rightSelectHandler(e, item);
              }}
              isSelect={rightSelect.find((find: any) => find[id] == item[id]) ? true : false}
            >
              {item[label]} {item[id]}
            </MultiSelectItem>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
