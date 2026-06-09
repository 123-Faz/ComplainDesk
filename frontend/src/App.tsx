import { BrowserRouter } from "react-router-dom"
import Router from "./routes"
import { Bounce, toast, ToastContainer } from "react-toastify"
import useGetCurrentUser from "./hooks/useGetCurrentUser"
import Loader from "./components/custom/Loader"
import { useEffect } from "react"
import { useAppDispatch } from "./store/hooks"
import { logout, setUser } from "./store/authSlice"
import { initDarkMode } from "./store/darkModeSlice"

function App() {

  const dispatch = useAppDispatch()
  const { data, error, isLoading } = useGetCurrentUser()


  useEffect(() => {

    dispatch(initDarkMode())

    if (data) {
      dispatch(setUser(data))
    }

    if (error) {
      dispatch(logout())
      toast.error("Session expired.Please Login again")
    }

  }, [dispatch, data, error])
  return (
    <BrowserRouter>
      <Router />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      {(isLoading) && <Loader />}
    </BrowserRouter>
  )
}

export default App
