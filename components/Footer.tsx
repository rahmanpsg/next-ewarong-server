const Footer = () => {
  const tahun = new Date().getFullYear();

  return (
    <footer className="footer footer-center p-4 bg-primary text-base-content">
      <div>
        <p>Copyright © {tahun} - E-Warong</p>
      </div>
    </footer>
  );
};

export default Footer;
