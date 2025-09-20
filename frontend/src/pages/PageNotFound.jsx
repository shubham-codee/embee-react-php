import { Button } from '@mui/material';
import { useNavigate } from 'react-router';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white text-gray-800">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl font-semibold mb-2">Page Not Found</p>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/')}
      >
        Go to Home
      </Button>
    </div>
  );
};

export default NotFoundPage;
