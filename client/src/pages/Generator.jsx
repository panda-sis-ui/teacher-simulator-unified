import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const Generator = () => {
  return (
    <>
      <Header />
      <main className="container" style={{ padding: '3rem 0' }}>
        <h1>Генератор JSON</h1>
        <p>Страница в разработке...</p>
      </main>
      <Footer isCatalogPage={false} />
    </>
  );
};

export default Generator;
