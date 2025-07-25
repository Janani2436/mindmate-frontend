// MindMate frontend - ExportButton.js
import React from 'react';
import { Download } from 'lucide-react';
import { downloadChatAsTxt } from '../utils/exportUtils';

const ExportButton = () => {
  return (
    <button
      onClick={downloadChatAsTxt}
      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow"
    >
      <Download size={18} />
      Export Chat (.txt)
    </button>
  );
};

export default ExportButton;
