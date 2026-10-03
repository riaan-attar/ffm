import React from 'react';
import { Link } from 'react-router-dom';

export function WorkItem({ project, reverse }) {
  return (
    <article className={`work-card ${reverse ? 'work-card-reverse' : ''}`}>
      <div className="work-card-visual-col">
        <img
          src={project.image}
          alt={`${project.title} preview`}
          className="work-card-preview-img"
          loading="lazy"
        />
      </div>

      <div className="work-card-content-col">
        <span className="work-card-number">{project.number}</span>

        <h3 className="work-card-title">{project.title}</h3>

        <div className="work-card-tags">
          {project.tags.map((tag, i) => (
            <React.Fragment key={tag}>
              {i > 0 && <span className="work-card-tag-dot" aria-hidden="true">▪</span>}
              <span className="work-card-tag">{tag}</span>
            </React.Fragment>
          ))}
        </div>

        <p className="work-card-description">{project.description}</p>

        <Link to={`/work/${project.id}`} className="work-card-link">
          <span>VIEW CASE STUDY</span>
          <img
            src="/assets/services/service-arrow.svg"
            alt=""
            className="work-card-link-arrow"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
