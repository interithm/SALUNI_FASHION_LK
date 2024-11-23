import React from 'react'
import AboutPage from "@components/about/about-us";
import MainLayout from "@components/layout/MainLayout";
import Title from "@components/common/Title"
// import Customer from "@components/about/customer-reviews/Customers"
const page = () => {
  return (
<MainLayout>
  <div className="pt-20 pl-20 pr-20">
   <AboutPage/>
    {/*<Title  text="Customer Feedbacks"/>*/}
    {/*<Customer />*/}
  </div>
</MainLayout>
  )
}

export default page