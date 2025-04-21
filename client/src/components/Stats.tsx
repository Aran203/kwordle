interface StatisticsModalProps {
    isOpen: boolean;
    onClose: () => void;
    stats: {
      solves: number;
      streak: number;
    };
  }
  
  export default function StatisticsModal({ isOpen, onClose, stats }: StatisticsModalProps) {
    if (!isOpen) return null;
  
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };
  
    return (
      <div
        className="fixed inset-0 bg-opacity-50 flex items-center justify-start ml-10 z-50"
        onClick={handleOverlayClick}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
          <button
            className="absolute top-2 right-3 text-2xl text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            &times;
          </button>
          <h2 className="text-xl font-bold mb-4 text-center">Your Stats</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Solves:</span>
              <span>{stats.solves}</span>
            </div>
            <div className="flex justify-between">
              <span>Current Streak:</span>
              <span>{stats.streak}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  