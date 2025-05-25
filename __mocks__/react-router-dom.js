const React = require('react');
let mockActivePath = '';

const mockReactRouterDom = {
  MemoryRouter: ({ children, initialEntries }) => {
    mockActivePath = initialEntries && initialEntries.length > 0 ? initialEntries[0] : '';
    return React.createElement('div', null, children);
  },
  NavLink: ({ children, to, className }) => {
    const isActive = mockActivePath === to;
    const classNameValue = typeof className === 'function' ? className({ isActive }) : className;
    return React.createElement('a', { href: to, className: classNameValue }, children);
  },
  Outlet: () => React.createElement('div', null, 'Outlet'),
  Routes: ({ children }) => React.createElement('div', null, children),
  Route: ({ path, element }) => React.createElement('div', { 'data-path': path }, element),
  Navigate: ({ to }) => React.createElement('div', { 'data-navigate': to }),
  useNavigate: () => jest.fn(),
};

module.exports = mockReactRouterDom;