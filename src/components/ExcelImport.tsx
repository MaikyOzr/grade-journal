import React, { useState } from 'react';
import * as XLSX from 'xlsx';

interface ExcelImportProps {
  onDataImport: (data: any[]) => void;
}

const ExcelImport: React.FC<ExcelImportProps> = ({ onDataImport }) => {
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        onDataImport(jsonData);
      } catch (error) {
        console.error('Error processing Excel file:', error);
        alert('Помилка при обробці Excel файлу. Перевірте формат файлу.');
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="excel-import">
      <div className="file-upload">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          id="excel-file-input"
          style={{ display: 'none' }}
        />
        <label htmlFor="excel-file-input" className="upload-button">
          {fileName ? `Вибрано: ${fileName}` : 'Виберіть Excel файл'}
        </label>
      </div>
    </div>
  );
};

export default ExcelImport; 