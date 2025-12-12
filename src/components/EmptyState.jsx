import React from 'react';
import NoMessageIcon from '../assets/No message.svg';
import './EmptyState.css';

const EmptyState = ({ title, description }) => {
  return (
    <div className="empty-state">
      <div className="empty-state__content">
        <img 
          src={NoMessageIcon} 
          alt="" 
          className="empty-state__illustration"
        />
        <h3 className="empty-state__title">{title}</h3>
        {description && (
          <p className="empty-state__description">{description}</p>
        )}
      </div>
    </div>
  );
};

export default EmptyState;



