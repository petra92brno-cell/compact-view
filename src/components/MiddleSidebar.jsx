import React from 'react';

const MiddleSidebar = ({ activeTab, onTabChange }) => {
  const navigationItems = [
    'Scheduled',
    'Waiting for approval',
    'Rejected',
    'Publishing problems',
    'Assigned to me',
    'Sent',
    'Dark posts'
  ];

  return (
    <div className="w-64 bg-white border-r border-[#E4E5E6] flex flex-col h-full flex-shrink-0">
      {/* Header */}
      <div className="px-4 py-4 border-b border-[#E4E5E6] flex items-center justify-between">
        <h1 className="text-[16px] font-bold text-[#1A1F26] uppercase tracking-wide leading-[24px]">PUBLISHER</h1>
        <button className="p-1 hover:bg-[#F3F3F5] rounded transition-colors">
          <svg className="w-4 h-4 text-[#2F3744]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto">
        {/* First Group */}
        <div className="px-2 pt-1">
          <button 
            onClick={() => onTabChange('Calendar')}
            className={`w-full text-left px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-200 text-[13px] leading-[18px] ${
              activeTab === 'Calendar'
                ? 'bg-[#F3F3F5] text-[#1A1F26] font-bold'
                : 'text-[#2F3744] hover:bg-[#F3F3F5] font-normal'
            }`}
          >
            Calendar
          </button>
          <button className="w-full text-left px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-200 text-[13px] leading-[18px] text-[#2F3744] hover:bg-[#F3F3F5] font-normal">Instagram grid</button>
          <button className="w-full text-left px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-200 text-[13px] leading-[18px] text-[#2F3744] hover:bg-[#F3F3F5] font-normal">Emplifi link</button>
        </div>

        <div className="border-t border-[#D7D8D9] my-2"></div>

        {/* Second Group - Interactive Navigation */}
        <div className="px-2 pt-1">
          {navigationItems.map((item, index) => (
            <button
              key={index}
              onClick={() => onTabChange(item)}
              className={`w-full text-left px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-200 text-[13px] leading-[18px] ${
                activeTab === item
                  ? 'bg-[#F3F3F5] text-[#1A1F26] font-bold'
                  : 'text-[#2F3744] hover:bg-[#F3F3F5] font-normal'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="border-t border-[#D7D8D9] my-2"></div>

        {/* Third Group */}
        <div className="px-2 pt-1 pb-3">
          <button
            onClick={() => onTabChange('Drafts')}
            className={`w-full text-left px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-200 text-[13px] leading-[18px] ${
              activeTab === 'Drafts'
                ? 'bg-[#F3F3F5] text-[#1A1F26] font-bold'
                : 'text-[#2F3744] hover:bg-[#F3F3F5] font-normal'
            }`}
          >
            Drafts
          </button>
            <button className="w-full text-left px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-200 text-[13px] leading-[18px] text-[#2F3744] hover:bg-[#F3F3F5] font-normal">Preset templates</button>
        </div>

        <div className="border-t border-[#D7D8D9] my-2"></div>

        {/* Campaigns */}
        <div className="px-2 pt-1 pb-3">
          <button
            onClick={() => onTabChange('Campaigns')}
            className={`w-full text-left px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-200 text-[13px] leading-[18px] flex items-center gap-2 ${
              activeTab === 'Campaigns'
                ? 'bg-[#F3F3F5] text-[#1A1F26] font-bold'
                : 'text-[#2F3744] hover:bg-[#F3F3F5] font-normal'
            }`}
          >
            <span>Campaigns</span>
            <span className="inline-flex items-center px-1.5 py-0 rounded-full text-[9px] font-bold leading-[16px] tracking-wide uppercase" style={{ background: '#DBEAFE', color: '#2563EB' }}>NEW</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiddleSidebar;
