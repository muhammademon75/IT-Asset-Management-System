const fs = require('fs');

const code = `
  const handleDownloadDeptTemplate = () => {
    const headers = ["Department Name", "Status"];
    const rows = [
      ["Information Technology", "Active"],
      ["Human Resources", "Active"]
    ];
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.map(cell => \`"\${cell.replace(/"/g, '""')}"\`).join(","))].join("\\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "department_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportDepartmentsExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          alert('The uploaded file is empty.');
          return;
        }

        const rows = parseCSV(text);
        if (rows.length < 2) {
          alert('No data rows found in the CSV/Excel file.');
          return;
        }

        const fileHeaders = rows[0].map(h => h.trim().toLowerCase());
        const nameIdx = fileHeaders.findIndex(h => h.includes('name'));
        const statusIdx = fileHeaders.findIndex(h => h.includes('status'));

        if (nameIdx === -1) {
          alert('Could not find "Name" column in Excel/CSV headers.');
          return;
        }

        const deptsToImport: any[] = [];
        const errors: string[] = [];

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (row.length === 0 || (row.length === 1 && !row[0].trim())) continue;

          const rawName = nameIdx !== -1 ? row[nameIdx]?.trim() : '';
          const rawStatus = statusIdx !== -1 ? row[statusIdx]?.trim() : '';

          if (!rawName) {
            errors.push(\`Row \${i + 1}: Name column is blank. Skipped row.\`);
            continue;
          }

          let statusValue: 'Active' | 'Inactive' = 'Active';
          if (rawStatus && rawStatus.toLowerCase().includes('inactive')) {
            statusValue = 'Inactive';
          }

          deptsToImport.push({
            name: rawName,
            status: statusValue
          });
        }

        if (deptsToImport.length === 0) {
          alert('No valid rows were found to import.');
          return;
        }

        setParsedDepts(deptsToImport);
        setDeptImportErrors(errors);
        setShowDeptImportPreview(true);
      } catch (err) {
        console.error(err);
        alert('An error occurred while parsing the file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmDeptImport = () => {
    if (parsedDepts.length === 0) return;
    if (onImportDepartments) {
      onImportDepartments(parsedDepts);
    } else {
      parsedDepts.forEach(dept => onAddDepartment(dept));
    }
    setShowDeptImportPreview(false);
    setParsedDepts([]);
    setDeptImportErrors([]);
    alert(\`Successfully imported \${parsedDepts.length} departments!\`);
  };

  const handleDownloadDesgTemplate = () => {
    const headers = ["Designation Name", "Status"];
    const rows = [
      ["Senior Developer", "Active"],
      ["HR Executive", "Active"]
    ];
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.map(cell => \`"\${cell.replace(/"/g, '""')}"\`).join(","))].join("\\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "designation_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportDesignationsExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          alert('The uploaded file is empty.');
          return;
        }

        const rows = parseCSV(text);
        if (rows.length < 2) {
          alert('No data rows found in the CSV/Excel file.');
          return;
        }

        const fileHeaders = rows[0].map(h => h.trim().toLowerCase());
        const nameIdx = fileHeaders.findIndex(h => h.includes('name'));
        const statusIdx = fileHeaders.findIndex(h => h.includes('status'));

        if (nameIdx === -1) {
          alert('Could not find "Name" column in Excel/CSV headers.');
          return;
        }

        const desgsToImport: any[] = [];
        const errors: string[] = [];

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (row.length === 0 || (row.length === 1 && !row[0].trim())) continue;

          const rawName = nameIdx !== -1 ? row[nameIdx]?.trim() : '';
          const rawStatus = statusIdx !== -1 ? row[statusIdx]?.trim() : '';

          if (!rawName) {
            errors.push(\`Row \${i + 1}: Name column is blank. Skipped row.\`);
            continue;
          }

          let statusValue: 'Active' | 'Inactive' = 'Active';
          if (rawStatus && rawStatus.toLowerCase().includes('inactive')) {
            statusValue = 'Inactive';
          }

          desgsToImport.push({
            name: rawName,
            status: statusValue
          });
        }

        if (desgsToImport.length === 0) {
          alert('No valid rows were found to import.');
          return;
        }

        setParsedDesgs(desgsToImport);
        setDesgImportErrors(errors);
        setShowDesgImportPreview(true);
      } catch (err) {
        console.error(err);
        alert('An error occurred while parsing the file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmDesgImport = () => {
    if (parsedDesgs.length === 0) return;
    if (onImportDesignations) {
      onImportDesignations(parsedDesgs);
    } else {
      parsedDesgs.forEach(desg => onAddDesignation(desg));
    }
    setShowDesgImportPreview(false);
    setParsedDesgs([]);
    setDesgImportErrors([]);
    alert(\`Successfully imported \${parsedDesgs.length} designations!\`);
  };
`;

let content = fs.readFileSync('src/components/HrmsView.tsx', 'utf8');
content = content.replace(
  /const handleConfirmImport = \(\) => \{[\s\S]*?alert\(\`Successfully imported \$\{parsedEmployees\.length\} employees to the database!\`\);\n  \};/,
  match => match + '\n' + code
);
fs.writeFileSync('src/components/HrmsView.tsx', content);
