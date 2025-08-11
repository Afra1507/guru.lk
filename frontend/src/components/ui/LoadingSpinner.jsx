import React from "react";

const LoadingSpinner = ({ message = "", size = "md" }) => {
  const sizes = {
    sm: 6,
    md: 10,
    lg: 14,
  };
  const barWidth = sizes[size] || sizes.md;

  return (
    <>
      <style>{`
        .loader3 {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 4px;
          margin: 20px 0;
        }

        .bars {
          width: ${barWidth}px;
          height: ${barWidth * 2}px;
          border-radius: 4px;
          background-color: #4285F4;
          animation: loader3 3s ease-in-out infinite;
        }

        .bar1 { animation-delay: -0.8s; }
        .bar2 { animation-delay: -0.7s; }
        .bar3 { animation-delay: -0.6s; }
        .bar4 { animation-delay: -0.5s; }
        .bar5 { animation-delay: -0.4s; }
        .bar6 { animation-delay: -0.3s; }
        .bar7 { animation-delay: -0.2s; }
        .bar8 { animation-delay: -0.1s; }
        .bar9 { animation-delay: 0s; }
        .bar10 { animation-delay: 0.1s; }

        @keyframes loader3 {
          0% { transform: scale(1); }
          20% { transform: scale(1, 2.32); }
          40% { transform: scale(1); }
        }

        .loading-message {
          text-align: center;
          color: #555;
          font-size: 14px;
          margin-top: 8px;
          font-family: Arial, sans-serif;
        }
      `}</style>

      <div role="status" aria-live="polite" aria-busy="true">
        <div className="loader3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`bars bar${i + 1}`} />
          ))}
        </div>
        {message && <div className="loading-message">{message}</div>}
      </div>
    </>
  );
};

export default LoadingSpinner;
