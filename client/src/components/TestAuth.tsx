import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login } from '../features/auth/authSlice';

export const TestAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);

  const handleTestLogin = () => {
    dispatch(login({
      email: "test@example.com",
      password: "password123"
    }));
  };

  return (
    <div className="p-4">
      <h2>Auth Test Component</h2>
      <button 
        onClick={handleTestLogin}
        className="btn-primary"
      >
        Test Login
      </button>

      <div className="mt-4">
        <h3>State:</h3>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(
            {
              user,
              isLoading,
              error
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}; 