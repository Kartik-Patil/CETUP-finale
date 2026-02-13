import React from 'react';

const PageContainer = ({ children, title, subtitle, actions }) => {
  return (
    <div className="p-8">
      {(title || subtitle || actions) && (
        <div className="mb-6 flex items-start justify-between">
          <div>
            {title && (
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-text-muted">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex gap-3">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
