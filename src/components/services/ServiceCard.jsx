import React from 'react';
import { Link } from 'react-router-dom';

export function ServiceCard({ service, index }) {
  const isDark = service.theme === 'dark';

  return (
    <article
      className={`service-card ${isDark ? 'service-card-dark' : 'service-card-light'}`}
    >
      {/* Left: Visual Column */}
      <div className="service-card-visual-col">
        <div className="service-card-header">
          <span className="service-card-number">{service.number}</span>
          <div className="service-card-badge-dot"></div>
        </div>

        <div className="service-card-visual">
          <img
            src={service.image}
            alt={service.title}
            className="service-card-img"
            loading="lazy"
          />
        </div>
      </div>

      {/* Right: Content Column */}
      <div className="service-card-body">
        <div className="service-card-text">
          <h3 className="service-card-title">{service.title}</h3>
          <p className="service-card-description">{service.description}</p>
        </div>

        {service.features && service.features.length > 0 && (
          <ul className="service-card-features">
            {service.features.map((feature, i) => (
              <li key={i} className="service-card-feature">
                <span className="service-card-feature-check" aria-hidden="true">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        <Link to={`/services/${service.id}`} className="service-card-btn">
          <span>LEARN MORE</span>
          <img
            src="/assets/services/service-arrow.svg"
            alt=""
            className="service-btn-arrow"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
