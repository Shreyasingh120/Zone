import { useState } from 'react';
import { toast } from 'react-toastify';

const useDeleteFileFolder = () => {
  
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteFileFolder = async (id, type) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/v1/file/delete/${type}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`${type} deleted successfully`);
        return true;
      } else {
        throw new Error(`Failed to delete ${type}`);
      }
    } catch (error) {
      toast.error(`Error deleting ${type}: ${error.message}`);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteFileFolder, isDeleting };
};
export default useDeleteFileFolder;