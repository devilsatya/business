import React from 'react'
import { AiOutlineGift } from 'react-icons/ai'
import { BiMessageSquareDetail } from 'react-icons/bi'
import { FiPackage, FiShoppingBag } from 'react-icons/fi'
import { MdOutlineLocalOffer } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const AdminHeader = () => {
    const {user} = useSelector((state) => state.user);

  return (
         <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div>
        <Link to="/">
        { /* <img
                src="data:image/png;base64,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"
                alt="Logo"
              />*/}<h1 className="text-[40px]">FabreeKart</h1>
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <Link to="/dashboard-coupouns" className="800px:block hidden">
            <AiOutlineGift
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/dashboard-events" className="800px:block hidden">
            <MdOutlineLocalOffer
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/dashboard-products" className="800px:block hidden">
            <FiShoppingBag
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/dashboard-orders" className="800px:block hidden">
            <FiPackage color="#555" size={30} className="mx-5 cursor-pointer" />
          </Link>
          <Link to="/dashboard-messages" className="800px:block hidden">
            <BiMessageSquareDetail
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
            <img
              src={`${user?.avatar?.url}`}
              alt=""
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
        </div>
      </div>
    </div>
  )
}

export default AdminHeader