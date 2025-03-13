import React from 'react';

const VideoSection = ({ videoUrl }) => {
  return (
    <div className="video-section">
      <iframe
        src={videoUrl}
        title="Video explicativo"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoSection;
