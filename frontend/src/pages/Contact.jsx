import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

const Contact = () => {
  return (
    <div className="page-container">
      <div className="container">
        <h1 className="page-title text-gradient">Contact Us</h1>
        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginTop: '48px' }}>
          <div className="glass-card" style={{ padding: '32px' }}>
            <FiMapPin style={{ fontSize: '32px', color: '#B76E79', marginBottom: '16px' }} />
            <h3>Visit Us</h3>
            <p>Near old nagar Palika<br />Kotputli 303108</p>
          </div>
          <div className="glass-card" style={{ padding: '32px' }}>
            <FiPhone style={{ fontSize: '32px', color: '#B76E79', marginBottom: '16px' }} />
            <h3>Call Us</h3>
            <p>+91 8306038989<br />+91 8107708989</p>
          </div>
          <div className="glass-card" style={{ padding: '32px' }}>
            <FiMail style={{ fontSize: '32px', color: '#B76E79', marginBottom: '16px' }} />
            <h3>Email Us</h3>
            <p>connectishori@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
