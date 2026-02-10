import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { allPosts } from '../../data/mockData';
import CampaignDialog from '../CampaignDialog';
import './CampaignsFeed.css';

/**
 * Compute campaign status based on dates relative to today.
 * - RUNNING: startDate <= today <= endDate
 * - SCHEDULED: startDate > today
 * - COMPLETED: endDate < today
 */
const getCampaignStatus = (campaign) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const start = new Date(campaign.startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(campaign.endDate);
  end.setHours(23, 59, 59, 999);

  if (now > end) return 'completed';
  if (now < start) return 'scheduled';
  return 'running';
};

/**
 * Calculate duration in days between two dates.
 */
const getDurationDays = (startDate, endDate) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff);
};

/**
 * Format date for display: "Sep 15, 2026"
 */
const formatDate = (date) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const d = new Date(date);
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

const STATUS_LABELS = {
  running: 'Running',
  scheduled: 'Scheduled',
  completed: 'Completed',
};

const FILTER_OPTIONS = [
  { value: 'all', label: 'All campaigns' },
  { value: 'running', label: 'Running' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
];

const CampaignsFeed = ({ campaigns = [], onCampaignsChange, userPosts = [], deletedPostIds = new Set() }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('startDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const filterRef = useRef(null);

  // Campaign dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  // Close filter dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Count scheduled posts per campaign
  const scheduledPostCounts = useMemo(() => {
    const counts = {};
    const allAvailablePosts = [
      ...allPosts.filter((p) => !deletedPostIds.has(p.id)),
      ...userPosts,
    ];
    allAvailablePosts.forEach((post) => {
      const cId = post.campaignId || post.campaign?.id;
      if (cId) {
        counts[cId] = (counts[cId] || 0) + 1;
      }
    });
    return counts;
  }, [userPosts, deletedPostIds]);

  // Enrich campaigns with status
  const enrichedCampaigns = useMemo(() => {
    return campaigns.map((c) => ({
      ...c,
      status: getCampaignStatus(c),
      duration: getDurationDays(c.startDate, c.endDate),
      scheduledPosts: scheduledPostCounts[c.id] || 0,
    }));
  }, [campaigns, scheduledPostCounts]);

  // Filter and search
  const filteredCampaigns = useMemo(() => {
    let result = enrichedCampaigns;

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.uniqueId && c.uniqueId.toLowerCase().includes(q))
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      let valA, valB;
      switch (sortField) {
        case 'name':
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          return sortDirection === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        case 'startDate':
          valA = new Date(a.startDate).getTime();
          valB = new Date(b.startDate).getTime();
          break;
        case 'duration':
          valA = a.duration;
          valB = b.duration;
          break;
        case 'status':
          const order = { running: 0, scheduled: 1, completed: 2 };
          valA = order[a.status];
          valB = order[b.status];
          break;
        default:
          valA = new Date(a.startDate).getTime();
          valB = new Date(b.startDate).getTime();
      }
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [enrichedCampaigns, statusFilter, searchQuery, sortField, sortDirection]);

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredCampaigns.map((c) => c.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Open campaign detail dialog
  const handleOpenCampaign = useCallback((campaign) => {
    setEditingCampaign({
      id: campaign.id,
      name: campaign.name || campaign.title,
      color: campaign.color,
      startDate: new Date(campaign.startDate),
      endDate: new Date(campaign.endDate),
      uniqueId: campaign.uniqueId || '',
      labels: campaign.labels || [],
      briefContent: campaign.briefContent || '',
    });
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setEditingCampaign(null);
  }, []);

  // Save campaign edits
  const handleSaveCampaign = useCallback((campaignData) => {
    if (onCampaignsChange) {
      onCampaignsChange((prev) =>
        prev.map((c) =>
          c.id === campaignData.id
            ? {
                ...c,
                name: campaignData.name,
                title: campaignData.name,
                color: campaignData.color,
                startDate: campaignData.startDate,
                endDate: campaignData.endDate,
                labels: campaignData.labels || [],
                briefContent: campaignData.briefContent || '',
              }
            : c
        )
      );
    }
    setIsDialogOpen(false);
    setEditingCampaign(null);
  }, [onCampaignsChange]);

  // Delete campaign
  const handleDeleteCampaign = useCallback((campaignId) => {
    if (onCampaignsChange) {
      onCampaignsChange((prev) => prev.filter((c) => c.id !== campaignId));
    }
    setIsDialogOpen(false);
    setEditingCampaign(null);
  }, [onCampaignsChange]);

  const allSelected =
    filteredCampaigns.length > 0 &&
    filteredCampaigns.every((c) => selectedIds.has(c.id));

  // When the dialog is open, render it full-screen instead of the table
  if (isDialogOpen && editingCampaign) {
    return (
      <CampaignDialog
        isOpen={true}
        onClose={handleCloseDialog}
        selectedDate={editingCampaign.startDate}
        onSaveCampaign={handleSaveCampaign}
        onDeleteCampaign={handleDeleteCampaign}
        mode="edit"
        campaignData={editingCampaign}
      />
    );
  }

  return (
    <div className="campaigns-feed">
      {/* Header */}
      <div className="campaigns-feed__header">
        <h2 className="campaigns-feed__title">Campaigns</h2>
        <div className="campaigns-feed__header-right">
          {/* Search */}
          <div className="campaigns-feed__search">
            <svg
              className="campaigns-feed__search-icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M7.333 12.667A5.333 5.333 0 107.333 2a5.333 5.333 0 000 10.667zM14 14l-2.9-2.9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              className="campaigns-feed__search-input"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status filter dropdown */}
          <div className="campaigns-feed__filter" ref={filterRef}>
            <button
              className="campaigns-feed__filter-btn"
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
            >
              <span>Show:</span>
              <span className="campaigns-feed__filter-value">
                {FILTER_OPTIONS.find((o) => o.value === statusFilter)?.label}
              </span>
              <svg
                className={`campaigns-feed__filter-arrow ${filterDropdownOpen ? 'campaigns-feed__filter-arrow--open' : ''}`}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M4 6l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {filterDropdownOpen && (
              <div className="campaigns-feed__filter-menu">
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className={`campaigns-feed__filter-option ${statusFilter === opt.value ? 'campaigns-feed__filter-option--active' : ''}`}
                    onClick={() => {
                      setStatusFilter(opt.value);
                      setFilterDropdownOpen(false);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="campaigns-feed__table-wrapper">
        <table className="campaigns-feed__table">
          <thead>
            <tr>
              <th className="campaigns-feed__th-checkbox">
                <input
                  type="checkbox"
                  className="campaigns-feed__checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="campaigns-feed__th-name">
                <button
                  className="campaigns-feed__sort-btn"
                  onClick={() => handleSort('name')}
                >
                  <span className="campaigns-feed__th-label">Name</span>
                </button>
              </th>
              <th className="campaigns-feed__th-startdate">
                <button
                  className="campaigns-feed__sort-btn"
                  onClick={() => handleSort('startDate')}
                >
                  {sortField === 'startDate' && (
                    <svg
                      className={`campaigns-feed__sort-icon ${sortDirection === 'asc' ? 'campaigns-feed__sort-icon--asc' : ''}`}
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M6 2v8M6 10l3-3M6 10L3 7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  <span className="campaigns-feed__th-label">Start date</span>
                </button>
              </th>
              <th className="campaigns-feed__th-duration">
                <button
                  className="campaigns-feed__sort-btn"
                  onClick={() => handleSort('duration')}
                >
                  <span className="campaigns-feed__th-label">Duration</span>
                </button>
              </th>
              <th className="campaigns-feed__th-status">
                <button
                  className="campaigns-feed__sort-btn"
                  onClick={() => handleSort('status')}
                >
                  <span className="campaigns-feed__th-label">Status</span>
                </button>
              </th>
              <th className="campaigns-feed__th-uniqueid">
                <span className="campaigns-feed__th-label">Unique ID</span>
              </th>
              <th className="campaigns-feed__th-posts">
                <span className="campaigns-feed__th-label">
                  Number of Scheduled posts
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.length === 0 ? (
              <tr>
                <td colSpan="7" className="campaigns-feed__empty">
                  {searchQuery || statusFilter !== 'all'
                    ? 'No campaigns match your filters.'
                    : 'No campaigns yet.'}
                </td>
              </tr>
            ) : (
              filteredCampaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className={`campaigns-feed__row ${selectedIds.has(campaign.id) ? 'campaigns-feed__row--selected' : ''}`}
                  onMouseEnter={() => setHoveredRowId(campaign.id)}
                  onMouseLeave={() => setHoveredRowId(null)}
                  onClick={() => handleOpenCampaign(campaign)}
                >
                  <td className="campaigns-feed__td-checkbox" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="campaigns-feed__checkbox"
                      checked={selectedIds.has(campaign.id)}
                      onChange={() => handleSelectRow(campaign.id)}
                    />
                  </td>
                  <td className="campaigns-feed__td-name">
                    <div className="campaigns-feed__name-cell">
                      <div
                        className="campaigns-feed__color-bar"
                        style={{ backgroundColor: campaign.color }}
                      />
                      <span className="campaigns-feed__campaign-link">
                        {campaign.name}
                      </span>
                      {hoveredRowId === campaign.id && (
                        <button className="campaigns-feed__row-menu" aria-label="More actions" onClick={(e) => e.stopPropagation()}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="4" r="1.25" fill="currentColor" />
                            <circle cx="8" cy="8" r="1.25" fill="currentColor" />
                            <circle cx="8" cy="12" r="1.25" fill="currentColor" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="campaigns-feed__td-startdate">
                    {formatDate(campaign.startDate)}
                  </td>
                  <td className="campaigns-feed__td-duration">
                    {campaign.duration} {campaign.duration === 1 ? 'day' : 'days'}
                  </td>
                  <td className="campaigns-feed__td-status">
                    <span
                      className={`campaigns-feed__status-badge campaigns-feed__status-badge--${campaign.status}`}
                    >
                      {campaign.status === 'running' && (
                        <span className="campaigns-feed__status-dot" />
                      )}
                      {STATUS_LABELS[campaign.status]}
                    </span>
                  </td>
                  <td className="campaigns-feed__td-uniqueid">
                    {campaign.uniqueId || '—'}
                  </td>
                  <td className="campaigns-feed__td-posts">
                    {campaign.scheduledPosts > 0 ? campaign.scheduledPosts : ''}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignsFeed;
