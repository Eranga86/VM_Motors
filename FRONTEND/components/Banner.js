import React from 'react'
import img1 from '../assests/img1.jpg';
import '../styles/banner.css'

export default function Banner() {
  return (
    <div>
        <section class="new-bannerb">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <img src={img1} class="img-fluidb" alt="Banner Image"/>
        </div>
        <div class="col-md-6">
          <div class="content">
            <br/><h2>Welcome to V & M Motors!</h2><br/>
            <p>Welcome to V & M Motors, your trusted partner in automotive excellence. At V & M Motors, we are dedicated to providing top-notch automotive services and ensuring your vehicle runs smoothly and efficiently. Our expert technicians utilize the latest technology and genuine parts to deliver high-quality maintenance and repairs. </p>
            <p>In addition to our comprehensive services, we specialize in providing a wide range of spare parts for buses, ensuring your fleet remains in optimal condition. With our customer-centric approach and competitive pricing, we guarantee the best value for your money. Experience the difference at V & M Motors, where your satisfaction is our priority.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
    </div>
  )
}
