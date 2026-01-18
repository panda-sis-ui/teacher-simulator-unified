import React from 'react';
import './Footer.css';

const Footer = ({ isCatalogPage = false }) => {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          © 2026 {isCatalogPage ? 'PedSim' : 'Симулятор учителя'} —
          дипломный проект по направлению «Прикладная информатика»
        </p>
        <p>

        </p>
      </div>
    </footer>
  );
};

export default Footer;
