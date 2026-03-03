import React from 'react';
import { mockUsers } from '../data/mockUsers';
import './TeamMembersTooltip.css';

const TeamMembersTooltip = ({ team, isVisible }) => {
  if (!isVisible || !team) return null;

  // Získat uživatele patřící do týmu
  const teamMembers = mockUsers.filter(user => team.memberIds.includes(user.id));

  return (
    <div className="team-members-tooltip" onClick={(e) => e.stopPropagation()}>
      <div className="team-members-tooltip__header">
        <span
          className="team-members-tooltip__team-avatar"
          style={{ backgroundColor: team.color || '#3B82F6' }}
        >
          {team.name.charAt(0).toUpperCase()}
        </span>
        <div className="team-members-tooltip__header-text">
          <span className="team-members-tooltip__team-name">{team.name}</span>
          <span className="team-members-tooltip__member-count">
            {teamMembers.length} {teamMembers.length === 1 ? 'Member' : 'Members'}
          </span>
        </div>
      </div>

      <div className="team-members-tooltip__divider" />

      <div className="team-members-tooltip__list">
        {teamMembers.map(member => (
          <div key={member.id} className="team-members-tooltip__member">
            <span className="team-members-tooltip__member-avatar">
              {member.avatar || member.name.charAt(0).toUpperCase()}
            </span>
            <div className="team-members-tooltip__member-info">
              <span className="team-members-tooltip__member-name">{member.name}</span>
              <span className="team-members-tooltip__member-email">{member.email}</span>
            </div>
            <span className="team-members-tooltip__member-role">
              {member.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamMembersTooltip;