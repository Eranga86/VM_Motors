import React from 'react';
import '../styles/BrandBanner.css'; // Import the CSS file for styling

// Import brand logos
import BoschLogo from '../assests/Bosch.jpg';
import DensoLogo from '../assests/Denso.png';
import DelphiLogo from '../assests/delphi.png';
import ACDelcoLogo from '../assests/acdelco.png';
import ValeoLogo from '../assests/valeo.png';
import HellaLogo from '../assests/hella.jpg';

const BrandBanner = () => {
  const brands = [
    { name: 'Bosch', logo: BoschLogo },
    { name: 'Denso', logo: DensoLogo },
    { name: 'Delphi', logo: DelphiLogo },
    { name: 'ACDelco', logo: ACDelcoLogo },
    { name: 'Valeo', logo: ValeoLogo },
    { name: 'Hella', logo: HellaLogo },
  ];

  return (
    <div className="brand-banner">
      <h2>Our Brands</h2>
      <div className="brand-logos">
        {brands.map((brand, index) => (
          <div key={index} className="brand-logo">
            <img src={brand.logo} alt={brand.name} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandBanner;
