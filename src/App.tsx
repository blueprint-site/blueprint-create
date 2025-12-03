import {RouterProvider, createBrowserRouter} from "react-router-dom"
import { routes } from "@/routes/index"
import { ThemeProvider } from "./components/theme-provider"

function App() {
  return (
    <>
      <ThemeProvider>
        <RouterProvider router={createBrowserRouter(routes)} />
      </ThemeProvider>
    </>
    )
}
export default App;