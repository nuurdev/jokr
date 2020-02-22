import './navbar.scss';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Navbar,
  NavbarItem,
  NavbarBrand,
  Icon,
  NavbarBurger,
  NavbarMenu,
  NavbarDropdown,
  NavbarDivider,
  NavbarEnd,
  NavbarStart,
  Field,
  Control,
  Button,
  Container
} from 'bloomer';
import { NavLink } from 'react-router-dom';
import { logoutUser } from '../../reducers/auth';
import logoIcon from '../../assets/logo-icon.svg';

const Nav: React.FC = () => {
  const [burgerMenu, setBurgerMenu] = useState<boolean>(false);
  const dispatch = useDispatch();

  const logout = e => {
    e.preventDefault();
    dispatch(logoutUser());
  };

  const toggleBurgerMenu = () => {
    setBurgerMenu(!burgerMenu);
  };

  return (
    <Navbar data-testid="primary-nav" className="primary-nav mb-5">
      <Container>
        <NavbarBrand>
          <NavbarItem>
            <img src={logoIcon} alt="logo" className="logo" />
          </NavbarItem>
          <NavbarBurger isActive={burgerMenu} onClick={toggleBurgerMenu} />
        </NavbarBrand>
        <NavbarMenu isActive={burgerMenu} onClick={toggleBurgerMenu}>
          <NavbarStart>
            <NavLink exact to="/" className="navbar-item">
              Home
            </NavLink>
            <NavLink to="/notifications" className="navbar-item">
              Notifications
            </NavLink>
          </NavbarStart>
          <NavbarEnd>
            <NavbarItem hasDropdown isHoverable>
              <NavLink exact to="/account" className="navbar-item is-arrowless">
                Account
              </NavLink>
              <NavbarDropdown className="is-right">
                <NavLink to="/posts" className="navbar-item">
                  <Icon className="fa fa-paper-plane mr-3" />
                  Your posts
                </NavLink>
                <NavLink to="/profile" className="navbar-item">
                  <Icon className="fa fa-paper-plane mr-3" />
                  Your profile
                </NavLink>
                <NavbarDivider />
                <NavbarItem href="#" onClick={logout}>
                  <Icon className="fa fa-paper-plane mr-3" />
                  Log out
                </NavbarItem>
              </NavbarDropdown>
            </NavbarItem>
            <NavbarItem>
              <Field isGrouped>
                <Control>
                  <Button
                    isColor="primary"
                    onClick={() => undefined}
                    isFullWidth
                  >
                    <Icon className="fa fa-paper-plane" />
                    <span>Post joke</span>
                  </Button>
                </Control>
              </Field>
            </NavbarItem>
          </NavbarEnd>
        </NavbarMenu>
      </Container>
    </Navbar>
  );
};

export default Nav;
