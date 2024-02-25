import React, { useState, useEffect } from 'react';

function DropDown({ className, options, setSelected, selected }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [openSearch, setOpenSearch] = useState(false);

  useEffect(() => {
    if (searchTerm.length === 0) {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter((option) =>
        option.food_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log(filtered.length, searchTerm, options.length, options, filtered);
      filtered.length > 0 ? setOpenSearch(true) : setOpenSearch(false);
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

  // Handler for selecting an item
  const handleSelectItem = (item) => {
    setSearchTerm(item.food_name); // Update the search term (and thereby the input field)
    setSelected(item); // Update the selected item in parent component
    setOpenSearch(false); // Close the dropdown
  };

  return (
    <div className={`dropdown ${className} relative items-center`}>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setOpenSearch(true)} // Optionally open dropdown onFocus
        //onBlur={() => setOpenSearch(false)} // Optionally close dropdown onFocusOut
        className="input input-bordered w-full max-w-xs"
      /> 
      {openSearch && filteredOptions.length > 0 && (
        <div className='flex flex-col gap-2 p-2 bg-base-200 border border-white/20 border-t-0 rounded-b-md absolute top-12 left-2 max-h-96 z-50'>
          {filteredOptions.map((item, index) => (
            <div 
              onClick={() => handleSelectItem(item)}
              className='px-2 cursor-pointer hover:bg-white/50 rounded' 
              key={index} 
              
            >
              {item.food_name || item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DropDown;
