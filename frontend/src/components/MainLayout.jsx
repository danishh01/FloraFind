import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <>
    <div className='relative'>
        <Navbar/>

        <Outlet/>
    </div>
    </>
  )
}

export default MainLayout