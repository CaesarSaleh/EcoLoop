import React, { useState } from 'react';

const CsvFileReader = () => {
  let dataList = []
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
          const columns = rows[i].split(',\"');

          // Skip empty rows
          if (columns.length === headers.length) {
            const rowData = {};

            for (let j = 1; j < headers.length; j++) {
              let key = headers[j].trim()
              key = key.replace("\r", "")
              let val = columns[j].trim()
              val = val.replace("\r", "")
              rowData[key] = val;
            }
            
            dataList.push(rowData);
          }
        }
      };

      reader.readAsText(file);
    } else {
      console.error('No file selected');
    }



  };

  const handleImport = async () => {
    const response = await fetch('http://localhost:4000/validate_dataset', {
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
