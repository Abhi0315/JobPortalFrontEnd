import React, { useState, useRef, useEffect } from 'react';
import { 
  FaShare, 
  FaLink, 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaWhatsapp,
  FaEnvelope,
  FaReddit,
  FaTelegram,
  FaTimes,
  FaCheck,
  FaClipboard
} from 'react-icons/fa';
import '../styles/ShareComponent.css';

const ShareComponent = ({ url, title, description, theme = 'light' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(null);
  const popupRef = useRef(null);

  // Close popup when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  

  const handleShareClick = () => {
    setIsOpen(!isOpen);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: copied ? <FaCheck /> : <FaClipboard />,
      action: copyToClipboard,
      color: '#6c757d',
      id: 'copy'
    },
    {
      name: 'Facebook',
      icon: <FaFacebook />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: '#1877f2',
      id: 'facebook'
    },
    {
      name: 'Twitter',
      icon: <FaTwitter />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: '#1da1f2',
      id: 'twitter'
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedin />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: '#0a66c2',
      id: 'linkedin'
    },
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp />,
      url: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
      color: '#25d366',
      id: 'whatsapp'
    },
    {
      name: 'Email',
      icon: <FaEnvelope />,
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + '\n\n' + url)}`,
      color: '#ea4335',
      id: 'email'
    },
    {
      name: 'Reddit',
      icon: <FaReddit />,
      url: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      color: '#ff4500',
      id: 'reddit'
    },
    {
      name: 'Telegram',
      icon: <FaTelegram />,
      url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: '#0088cc',
      id: 'telegram'
    }
  ];

  const openShareWindow = (shareUrl) => {
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  return (
    <div className={`share-container ${theme}`}>
      <button 
        className={`share-button ${isOpen ? 'active' : ''}`}
        onClick={handleShareClick}
        aria-label="Share"
        aria-expanded={isOpen}
      >
        <FaShare className="share-icon" />
        <span>Share</span>
      </button>

      {isOpen && (
        <div className="share-popup" ref={popupRef}>
          <div className="share-header">
            <h3>Share this job</h3>
            <button 
              className="close-button" 
              onClick={() => setIsOpen(false)}
              aria-label="Close share menu"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="share-options">
            {shareOptions.map((option) => (
              <div 
                key={option.id} 
                className="share-option"
                onMouseEnter={() => setHoveredOption(option.id)}
                onMouseLeave={() => setHoveredOption(null)}
              >
                {option.url ? (
                  <button
                    className={`share-platform ${hoveredOption === option.id ? 'hovered' : ''}`}
                    onClick={() => openShareWindow(option.url)}
                    style={{ '--hover-color': option.color }}
                    aria-label={`Share on ${option.name}`}
                  >
                    <div 
                      className="share-icon-wrapper"
                      style={{ backgroundColor: `${option.color}15` }}
                    >
                      {option.icon}
                    </div>
                    <span>{option.name}</span>
                  </button>
                ) : (
                  <button
                    className={`share-platform ${hoveredOption === option.id ? 'hovered' : ''} ${copied && option.id === 'copy' ? 'copied' : ''}`}
                    onClick={option.action}
                    style={{ '--hover-color': option.color }}
                    aria-label={option.name}
                  >
                    <div 
                      className="share-icon-wrapper"
                      style={{ backgroundColor: `${option.color}15` }}
                    >
                      {option.icon}
                    </div>
                    <span>{option.name}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {copied && (
            <div className="copied-message">
              <FaCheck className="check-icon" />
              <span>Link copied to clipboard!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShareComponent;