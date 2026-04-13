import './styles/main.scss';
import { createBrowserRouter } from "react-router";
import { ROUTES } from "./routes/ROUTES.jsx";
import { RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import { PulseLoader } from "react-spinners";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toaster from "./components/ui/Toaster.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 2,
    },
  },
});

function App() {
  const routes = createBrowserRouter(ROUTES);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={
        <div className="flex justify-center items-center h-screen w-full">
          <PulseLoader color="#22c55e" />
        </div>
      }>
        <RouterProvider router={routes} />
      </Suspense>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App