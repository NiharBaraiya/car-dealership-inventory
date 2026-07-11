export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>AutoVault Dealership</h3>
          <p>Premium vehicle inventory management system</p>
        </div>
        <div className="footer-links">
          <div className="footer-section">
            <h4>Platform</h4>
            <a href="/">Browse Inventory</a>
            <a href="/admin">Admin Dashboard</a>
          </div>
          <div className="footer-section">
            <h4>Features</h4>
            <span>Real-time Stock</span>
            <span>Smart Search</span>
            <span>Secure Purchases</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AutoVault Dealership. All rights reserved.</p>
      </div>
    </footer>
  );
};
