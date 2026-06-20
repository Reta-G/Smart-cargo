import React from 'react'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import Services from '../components/Services'
import HowItWorks from '../components/HowItWorks'
import Footer from '../components/Footer'
const Home = () => {
  return (
    <div>
      <Hero />
      <Stats />
      <Services />
      <HowItWorks />
      <Footer/>
    </div>
  )
}

export default Home
