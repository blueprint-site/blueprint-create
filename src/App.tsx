import {RouterProvider, createBrowserRouter} from "react-router-dom"
import { routes } from "@/routes/index"
import { ThemeProvider } from "./components/theme-provider"
import ThemeSwitch from "./components/ThemeSwitch"
function App() {
  return (
    <>
      <ThemeProvider>
        <RouterProvider router={createBrowserRouter(routes)} />
        <ThemeSwitch />
      </ThemeProvider>
    </>
    )
}
export default App;