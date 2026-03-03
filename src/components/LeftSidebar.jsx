import React from 'react';
import './LeftSidebar.css';
import VersionSwitcher from './VersionSwitcher';

// Import new icons
import iconHome from '../assets/Home.svg';
import iconAnalytics from '../assets/Icon.svg';
import iconCalendar from '../assets/Icon-1.svg';
import iconCommunity from '../assets/Icon-2.svg';
import iconCare from '../assets/Icon-3.svg';
import iconContent from '../assets/Icon-4.svg';
import iconUCG from '../assets/Icon-5.svg';
import iconBot from '../assets/Icon-6.svg';
import iconRatingReviews from '../assets/Icon-7.svg';
import iconHelp from '../assets/Icon-8.svg';
import iconSettings from '../assets/Icon-9.svg';
import iconEmplifi from '../assets/Emplifi.svg';
import imgAvatar from '../assets/9ce1b58aecd4ef61664409fcdd66adf48254ccb2.png';

const LeftSidebar = ({ activeVersion, onVersionChange }) => {
  return (
    <div className="left-sidebar">
      {/* Logo */}
      <div className="left-sidebar__logo">
        <div className="left-sidebar__logo-container">
          <img src={iconEmplifi} alt="Emplifi" className="left-sidebar__logo-img" />
        </div>
      </div>

      {/* Divider */}
      <div className="left-sidebar__divider"></div>

      {/* Navigation Icons */}
      <div className="left-sidebar__scroll-area">
        {/* Command Center (Home) */}
        <button className="left-sidebar__item">
          <img src={iconHome} alt="Command Center" className="left-sidebar__item-icon" />
        </button>

        {/* Unified Analytics */}
        <button className="left-sidebar__item">
          <img src={iconAnalytics} alt="Analytics" className="left-sidebar__item-icon" />
        </button>

        {/* Publisher - Active */}
        <button className="left-sidebar__item left-sidebar__item--active">
          <img src={iconCalendar} alt="Publisher" className="left-sidebar__item-icon" />
        </button>

        {/* Community */}
        <button className="left-sidebar__item">
          <img src={iconCommunity} alt="Community" className="left-sidebar__item-icon" />
        </button>

        {/* Care */}
        <button className="left-sidebar__item">
          <img src={iconCare} alt="Care" className="left-sidebar__item-icon" />
        </button>

        {/* Content */}
        <button className="left-sidebar__item">
          <img src={iconContent} alt="Content" className="left-sidebar__item-icon" />
        </button>

        {/* UCG */}
        <button className="left-sidebar__item">
          <img src={iconUCG} alt="UCG" className="left-sidebar__item-icon" />
        </button>

        {/* Bot */}
        <button className="left-sidebar__item">
          <img src={iconBot} alt="Bot" className="left-sidebar__item-icon" />
        </button>

        {/* Rating & Reviews */}
        <button className="left-sidebar__item">
          <img src={iconRatingReviews} alt="Rating & Reviews" className="left-sidebar__item-icon" />
        </button>
      </div>

      {/* Bottom Section */}
      <div className="left-sidebar__bottom-section">
        {/* Divider */}
        <div className="left-sidebar__divider"></div>

        {/* Bottom Group */}
        <div className="left-sidebar__bottom-group">
          {/* Help */}
          <button className="left-sidebar__item">
            <img src={iconHelp} alt="Help" className="left-sidebar__item-icon" />
          </button>

          {/* Settings */}
          <button className="left-sidebar__item">
            <img src={iconSettings} alt="Settings" className="left-sidebar__item-icon" />
          </button>

          {/* User Profile with Version Switcher */}
          <VersionSwitcher
            activeVersion={activeVersion}
            onVersionChange={onVersionChange}
          >
            <button className="left-sidebar__item">
              <div className="left-sidebar__profile">
                <div className="left-sidebar__avatar">
                  <img src={imgAvatar} alt="User" className="left-sidebar__avatar-img" />
                </div>
                <div className="left-sidebar__notification">
                  <span className="left-sidebar__notification-text">12</span>
                </div>
              </div>
            </button>
          </VersionSwitcher>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
