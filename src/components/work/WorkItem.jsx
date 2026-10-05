import React from 'react';
import { Link } from 'react-router-dom';
import { LiveSitePreview } from './LiveSitePreview';

export function WorkItem({ project, reverse, loadPreview }) {
  return (
    <article className={`work-card ${reverse ? 'work-card-reverse' : ''}`}>
      <div className="work-card-visual-col">
        {project.liveUrl ? (
          <LiveSitePreview
            url={project.liveUrl}
            title={project.title}
            className="work-card-preview-img"
            scale={0.42}
            loaded={loadPreview}
          />
        ) : (
          <img
            src={project.image}
            alt={`${project.title} preview`}
            className="work-card-preview-img"
            loading="lazy"
          />
        )}
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

        <div className="work-card-actions">
          <Link to={`/work/${project.id}`} className="work-card-link">
            <span>VIEW CASE STUDY</span>
            <img
              src="/assets/services/service-arrow.svg"
              alt=""
              className="work-card-link-arrow"
              aria-hidden="true"
            />
          </Link>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="work-card-preview-btn"
            >
              <span className="work-card-preview-play" aria-hidden="true">&#9654;</span>
              <span>VIEW LIVE PREVIEW</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
