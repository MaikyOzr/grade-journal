import React, { useState } from 'react';
import ExcelImport from './ExcelImport';

interface UniversalImportRow {
  "Ім'я": string;
  "Прізвище": string;
  "Група": string;
  "Назва курсу": string;
  "Викладач": string;
  "Семестр": number;
  "Рік": number;
  "Кафедра"?: string;
  "Лекції"?: number;
  "Практики"?: number;
}

interface AdminPanelProps {
  onUniversalImport: (rows: UniversalImportRow[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onUniversalImport }) => {
  const [importedRows, setImportedRows] = useState<UniversalImportRow[]>([]);

  const handleExcelImport = (data: any[]) => {
    const rows: UniversalImportRow[] = data.map(row => ({
      "Ім'я": row["Ім'я"] || '',
      "Прізвище": row["Прізвище"] || '',
      "Група": row["Група"] || '',
      "Назва курсу": row["Назва курсу"] || '',
      "Викладач": row["Викладач"] || '',
      "Семестр": Number(row["Семестр"]) || 0,
      "Рік": Number(row["Рік"]) || 0,
      "Кафедра": row["Кафедра"] || '',
      "Лекції": row["Лекції"] !== undefined ? Number(row["Лекції"]) : undefined,
      "Практики": row["Практики"] !== undefined ? Number(row["Практики"]) : undefined,
    }));
    setImportedRows(rows);
    onUniversalImport(rows);
  };

  return (
    <div className="admin-panel">
      <h2>Адмін-панель: Універсальний імпорт даних</h2>
      <p>Завантажте Excel-файл з такими колонками: Ім'я, Прізвище, Група, Назва курсу, Викладач, Семестр, Рік, Кафедра, Лекції, Практики</p>
      <ExcelImport onDataImport={handleExcelImport} />
      {importedRows.length > 0 && (
        <div className="import-preview">
          <h3>Попередній перегляд імпортованих даних:</h3>
          <table>
            <thead>
              <tr>
                <th>Ім'я</th>
                <th>Прізвище</th>
                <th>Група</th>
                <th>Назва курсу</th>
                <th>Викладач</th>
                <th>Семестр</th>
                <th>Рік</th>
                <th>Кафедра</th>
                <th>Лекції</th>
                <th>Практики</th>
              </tr>
            </thead>
            <tbody>
              {importedRows.map((row, idx) => (
                <tr key={idx}>
                  <td>{row["Ім'я"]}</td>
                  <td>{row["Прізвище"]}</td>
                  <td>{row["Група"]}</td>
                  <td>{row["Назва курсу"]}</td>
                  <td>{row["Викладач"]}</td>
                  <td>{row["Семестр"]}</td>
                  <td>{row["Рік"]}</td>
                  <td>{row["Кафедра"]}</td>
                  <td>{row["Лекції"]}</td>
                  <td>{row["Практики"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel; 