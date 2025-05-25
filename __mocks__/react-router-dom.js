const React = require('react');

// Global variable to track active path
let mockActivePath = '';

const mockReactRouterDom = {
  MemoryRouter: ({ children, initialEntries }) => {
    // Set active path from initialEntries
    mockActivePath = initialEntries && initialEntries.length > 0 ? initialEntries[0] : '';
    return React.createElement('div', null, children);
  },
  NavLink: ({ children, to, className }) => {
    // Determine isActive by comparing to with mockActivePath
    const isActive = mockActivePath === to;
    const classNameValue = typeof className === 'function' ? className({ isActive }) : className;
    return React.createElement('a', { href: to, className: classNameValue }, children);
  },
  Outlet: () => React.createElement('div', null, 'Outlet'),
};

module.exports = mockReactRouterDom;