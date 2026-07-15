const fs = require('fs');

const code = `
      {showDeptImportPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[75vh] shadow-2xl border border-slate-200 overflow-hidden text-slate-800 flex flex-col animate-in fade-in zoom-in-95 duration-150 font-sans">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center select-none">
              <div>
                <h3 className="text-sm font-black font-mono text-slate-900 uppercase tracking-wider mb-0">
                  Department Import Preview
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Verify the mapped records below before adding them to the database.
                </p>
              </div>
              <button 
                onClick={() => { setShowDeptImportPreview(false); setParsedDepts([]); setDeptImportErrors([]); }} 
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg hover:bg-slate-200 transition"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
              {deptImportErrors.length > 0 && (
                <div className="mb-6 p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
                  <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Import Warnings & Errors ({deptImportErrors.length})</span>
                  </div>
                  <ul className="list-disc pl-5 text-[11px] text-rose-600 font-medium space-y-1 font-mono">
                    {deptImportErrors.map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                </div>
              )}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-slate-200 border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold">
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider border-b border-slate-200">Department Name</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider border-b border-slate-200">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[12px] font-medium text-slate-700">
                    {parsedDepts.map((d, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2 border-b border-slate-100">{d.name}</td>
                        <td className="px-4 py-2 border-b border-slate-100">
                          <span className={\`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold \${d.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}\`}>
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-between items-center select-none">
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                Total Valid Rows: {parsedDepts.length}
              </span>
              <div className="flex space-x-3">
                <button 
                  onClick={() => { setShowDeptImportPreview(false); setParsedDepts([]); setDeptImportErrors([]); }}
                  className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition"
                >
                  Discard Import
                </button>
                <button 
                  onClick={handleConfirmDeptImport}
                  className="px-5 py-2.5 bg-[#107C41] hover:bg-[#0C5F32] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  Confirm & Import Departments
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDesgImportPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[75vh] shadow-2xl border border-slate-200 overflow-hidden text-slate-800 flex flex-col animate-in fade-in zoom-in-95 duration-150 font-sans">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center select-none">
              <div>
                <h3 className="text-sm font-black font-mono text-slate-900 uppercase tracking-wider mb-0">
                  Designation Import Preview
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Verify the mapped records below before adding them to the database.
                </p>
              </div>
              <button 
                onClick={() => { setShowDesgImportPreview(false); setParsedDesgs([]); setDesgImportErrors([]); }} 
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg hover:bg-slate-200 transition"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
              {desgImportErrors.length > 0 && (
                <div className="mb-6 p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
                  <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Import Warnings & Errors ({desgImportErrors.length})</span>
                  </div>
                  <ul className="list-disc pl-5 text-[11px] text-rose-600 font-medium space-y-1 font-mono">
                    {desgImportErrors.map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                </div>
              )}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-slate-200 border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold">
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider border-b border-slate-200">Designation Name</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider border-b border-slate-200">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[12px] font-medium text-slate-700">
                    {parsedDesgs.map((d, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2 border-b border-slate-100">{d.name}</td>
                        <td className="px-4 py-2 border-b border-slate-100">
                          <span className={\`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold \${d.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}\`}>
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-between items-center select-none">
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                Total Valid Rows: {parsedDesgs.length}
              </span>
              <div className="flex space-x-3">
                <button 
                  onClick={() => { setShowDesgImportPreview(false); setParsedDesgs([]); setDesgImportErrors([]); }}
                  className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition"
                >
                  Discard Import
                </button>
                <button 
                  onClick={handleConfirmDesgImport}
                  className="px-5 py-2.5 bg-[#107C41] hover:bg-[#0C5F32] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  Confirm & Import Designations
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
`;

let content = fs.readFileSync('src/components/HrmsView.tsx', 'utf8');
content = content.replace(
  /\{showImportPreview && \(/,
  match => code + '\n' + match
);
fs.writeFileSync('src/components/HrmsView.tsx', content);
