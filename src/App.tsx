import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { router } from "./routes/router";
import AuthProvider from "./AuthProvider";

const App = () => (
  <>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{ duration: 3000 }}
      />
    </AuthProvider>
  </>
);

export default App;
