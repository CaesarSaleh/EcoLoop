import React, { useState } from 'react';

const CsvFileReader = () => {
  const [dataList, setDataList] = useState([]);
  const handleFile = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (event) {
        const content = event.target.result;
        const rows = content.split('\n');

        const newDataList = [];

        // Assuming the first row contains headers
        const headers = rows[0].split(',');
        for (let i = 1; i < rows.length; i++) {
          const columns = rows[i].split('\",\"');

          
          
        }
        setDataList(newDataList);
        console.log(newDataList);
      };

      reader.readAsText(file);
    } else {
      console.error('No file selected');
    }

  };
  const handleImport = async () => {
    const response = await fetch('/api/validate_dataset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataList),
    });
  
    if (response.ok) {
      const data = await response.json();
      console.log(data.result)
    } else {
      throw new Error('Failed to fetch data');
    }
    
  }


  return (
    <div className='flex flex-col items-end pr-4'>
      <input className="p-1 m-1 text-sm bg-[#0b9541] text-white rounded-md w-2em h-2em" type="file" onChange={handleFile} accept=".csv" />
      <button className="p-1 m-1 text-sm bg-[#0b9541] text-white rounded-md" onClick={handleImport}>
        Import Dataset
      </button>
      <div hidden value={dataList} id={'dataList'}/>
    </div>
  );
};

export default CsvFileReader;
