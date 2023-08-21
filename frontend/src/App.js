import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/Root";
import Home from "./pages/Home";
import PostLayout from "./pages/Posts";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      id: "root",
      children:[
        { index:true, element: <Home/>, id: "home" },
        { path: "posts", element: <PostLayout/>, id: "post" },
      ]
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
