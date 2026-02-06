import React, { useState, useEffect, useMemo } from 'react';
import { PatientType, ConsultationRecord } from './types';
import { FEES, STORAGE_KEY, PATIENT_LABELS, PATIENT_COLORS } from './constants';
import { getClinicInsights } from './services/geminiService';
import StatsCard from './components/StatsCard';

const App: React.FC = () => {
  const [allRecords, setAllRecords] = useState<ConsultationRecord[]>([]);
  
  // Date range states (default to today)
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(today);
  
  const [insights, setInsights] = useState<string>('');
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Initialize data from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAllRecords(parsed);
      } catch (e) {
        console.error("Failed to parse storage", e);
      }
    }
  }, []);

  // Save all records to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allRecords));
  }, [allRecords]);

  const addRecord = (type: PatientType) => {
    const newRecord: ConsultationRecord = {
      id: crypto.randomUUID(),
      type,
      amount: FEES[type],
      timestamp: Date.now(),
    };
    setAllRecords(prev => [newRecord, ...prev]);
  };

  const deleteRecord = (id: string) => {
    setAllRecords(prev => prev.filter(r => r.id !== id));
  };

  const clearFilteredRange = () => {
    if (window.confirm("Delete ALL records in the CURRENT visible date range? This cannot be undone.")) {
      const startMs = new Date(startDate).setHours(0, 0, 0, 0);
      const endMs = new Date(endDate).setHours(23, 59, 59, 999);
      
      setAllRecords(prev => prev.filter(r => r.timestamp < startMs || r.timestamp > endMs));
      setInsights('');
    }
  };

  const fullReset = () => {
    if (window.confirm("CRITICAL: This will delete your ENTIRE history across all dates. Are you absolutely sure?")) {
      if (window.confirm("Final confirmation: This data is not recoverable. Proceed with full reset?")) {
        setAllRecords([]);
        setInsights('');
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  const exportToCSV = () => {
    if (allRecords.length === 0) return;
    
    const headers = ["Date", "Time", "Category", "Amount (INR)"];
    const rows = allRecords.map(r => {
      const date = new Date(r.timestamp);
      return [
        date.toLocaleDateString('en-IN'),
        date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        PATIENT_LABELS[r.type],
        r.amount
      ];
    });

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `neuro_revenue_full_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetToToday = () => {
    setStartDate(today);
    setEndDate(today);
  };

  // Filtered records
  const filteredRecords = useMemo(() => {
    const startMs = new Date(startDate).setHours(0, 0, 0, 0);
    const endMs = new Date(endDate).setHours(23, 59, 59, 999);
    return allRecords.filter(r => r.timestamp >= startMs && r.timestamp <= endMs);
  }, [allRecords, startDate, endDate]);

  const totalEarnings = useMemo(() => 
    filteredRecords.reduce((sum, r) => sum + r.amount, 0), 
  [filteredRecords]);

  const stats = useMemo(() => ({
    newCount: filteredRecords.filter(r => r.type === PatientType.NEW).length,
    followupCount: filteredRecords.filter(r => r.type === PatientType.FOLLOW_UP).length,
    ipCount: filteredRecords.filter(r => r.type === PatientType.IP_CONSULT).length,
  }), [filteredRecords]);

  const fetchAnalysis = async () => {
    if (filteredRecords.length === 0) return;
    setLoadingInsights(true);
    setInsights(''); // Reset previous
    const result = await getClinicInsights(filteredRecords);
    setInsights(result || '');
    setLoadingInsights(false);
  };

  const isSingleDay = startDate === endDate;

  return (
    <div className="min-h-screen pb-12 max-w-6xl mx-auto px-4 sm:px-6 bg-slate-50">
      {/* Header */}
      <header className="py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Neuro<span className="text-indigo-600">Revenue</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {isSingleDay 
              ? new Date(startDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
              : `${new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${new Date(endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button 
            onClick={fetchAnalysis}
            disabled={filteredRecords.length === 0 || loadingInsights}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md active:scale-95"
          >
            {loadingInsights ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Analyzing...
              </span>
            ) : (
              <><span>📊</span> Run Practice Analysis</>
            )}
          </button>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatsCard 
          label="Total Revenue" 
          value={`₹${totalEarnings.toLocaleString('en-IN')}`} 
          colorClass="text-emerald-600 bg-emerald-100" 
          icon="💰" 
        />
        <StatsCard 
          label="New OPD" 
          value={stats.newCount} 
          colorClass="text-indigo-600 bg-indigo-100" 
          icon="👤" 
        />
        <StatsCard 
          label="Follow-up" 
          value={stats.followupCount} 
          colorClass="text-cyan-600 bg-cyan-100" 
          icon="🔄" 
        />
        <StatsCard 
          label="IP Consult" 
          value={stats.ipCount} 
          colorClass="text-amber-600 bg-amber-100" 
          icon="🏥" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Sidebar Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Entry */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Entry</h2>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => addRecord(PatientType.NEW)}
                className="w-full py-4 px-6 bg-indigo-600 text-white rounded-2xl font-bold shadow-sm hover:bg-indigo-700 active:scale-[0.98] transition-all flex justify-between items-center"
              >
                <span>New Patient</span>
                <span className="bg-white/20 px-2 py-1 rounded text-xs">₹700</span>
              </button>
              <button 
                onClick={() => addRecord(PatientType.FOLLOW_UP)}
                className="w-full py-4 px-6 bg-emerald-600 text-white rounded-2xl font-bold shadow-sm hover:bg-emerald-700 active:scale-[0.98] transition-all flex justify-between items-center"
              >
                <span>Follow-up</span>
                <span className="bg-white/20 px-2 py-1 rounded text-xs">₹500</span>
              </button>
              <button 
                onClick={() => addRecord(PatientType.IP_CONSULT)}
                className="w-full py-4 px-6 bg-amber-500 text-white rounded-2xl font-bold shadow-sm hover:bg-amber-600 active:scale-[0.98] transition-all flex justify-between items-center"
              >
                <span>IP Consult</span>
                <span className="bg-white/20 px-2 py-1 rounded text-xs">₹1000</span>
              </button>
            </div>
          </section>

          {/* Date Range Filter */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Time Period</h2>
              <button onClick={resetToToday} className="text-xs font-bold text-indigo-600 hover:underline">Today</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
          </section>

          {/* Data Tools */}
          <section className="bg-slate-900 rounded-2xl p-6 shadow-xl text-white">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Practice Management</h2>
            <div className="space-y-3">
              <button 
                onClick={exportToCSV}
                className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                📥 Export Entire History
              </button>
              <button 
                onClick={clearFilteredRange}
                disabled={filteredRecords.length === 0}
                className="w-full py-3 text-amber-400 hover:text-amber-300 font-bold text-sm transition-colors border border-amber-900/50 rounded-xl disabled:opacity-20"
              >
                🧹 Clear Visible Filter
              </button>
              <div className="pt-2 mt-2 border-t border-white/5">
                 <button 
                  onClick={fullReset}
                  className="w-full py-3 text-red-500 hover:bg-red-500/10 font-black text-xs uppercase tracking-widest transition-all rounded-xl border border-red-500/20"
                >
                  ⚠️ Hard Reset App
                </button>
              </div>
            </div>
          </section>

          {insights && (
            <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-indigo-900 font-bold flex items-center gap-2">
                  <span>💡</span> Clinical Analysis
                </h3>
                <button onClick={() => setInsights('')} className="text-indigo-300 hover:text-indigo-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <p className="text-indigo-700 text-sm leading-relaxed italic whitespace-pre-line">
                {insights}
              </p>
            </div>
          )}
        </div>

        {/* Main List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
              <h2 className="font-bold text-slate-800">Clinical Log</h2>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                {filteredRecords.length} entries for selection
              </span>
            </div>
            
            {filteredRecords.length === 0 ? (
              <div className="py-20 text-center text-slate-400 flex flex-col items-center">
                <span className="text-4xl mb-4 opacity-20">🏥</span>
                <p className="text-sm font-medium">No records for this period.</p>
                <p className="text-xs mt-1">Start by adding a patient from the sidebar.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-50">
                {filteredRecords.map((record) => (
                  <li key={record.id} className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`w-2.5 h-2.5 rounded-full ${PATIENT_COLORS[record.type]}`} />
                      <div>
                        <p className="font-bold text-slate-700 text-sm">{PATIENT_LABELS[record.type]}</p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {new Date(record.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-black text-slate-600">₹{record.amount}</span>
                      <button 
                        onClick={() => deleteRecord(record.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {filteredRecords.length > 0 && (
            <div className="mt-4 p-5 bg-indigo-600 rounded-2xl text-white flex items-center justify-between shadow-lg shadow-indigo-100">
              <div>
                <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Period Revenue</p>
                <p className="text-xs font-medium italic opacity-80">Sum of {filteredRecords.length} visits</p>
              </div>
              <span className="text-3xl font-black">₹{totalEarnings.toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
