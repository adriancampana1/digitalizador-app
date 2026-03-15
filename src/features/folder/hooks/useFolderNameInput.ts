import { useState } from 'react';

export const useFolderNameInput = () => {
  const [folderName, setFolderName] = useState('');

  return {
    folderName,
    setFolderName,
    trimmedName: folderName.trim(),
    reset: () => setFolderName(''),
  };
};
