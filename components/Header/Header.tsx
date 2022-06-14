import React, { Fragment, useState, useRef, FormEvent } from "react";
import { useMoralis } from "react-moralis";
import { Blockie, WalletModal } from "web3uikit";
import { FiChevronDown } from "react-icons/fi";
import { getDisplayName } from "../../helpers/getDisplayName";
import { useRouter } from "next/router";
import COLORS from "../../constants/colors";
import { useClickOutside } from "../../hooks/useClickOutside";
import {
  Container,
  Search,
  Tab,
  Input,
  SearchIcon,
  MenuIcon,
  UserWrapper,
  UserAddress,
  Dropdown,
  DropdownLabel,
  DropdownArea,
  DropdownButton,
  DropdownItem,
} from "./HeaderStyled";
import StoreType from "../../types/StoreType";
import { useSelector } from "react-redux";
import { ParsedUrlQueryInput } from "querystring";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { isAuthenticated, user, logout } = useMoralis();
  const { pathname, push } = useRouter();
  const containerRef = useRef<HTMLElement>(null);
  const portfolioDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const isLandingPage = pathname === "/";
  const { isDarkMode } = useSelector((store: StoreType) => store.theme);

  const openAuthModal = () => {
    setIsConnectModalOpen(true);
    setIsMenuOpen(false);
  };

  const redirectTo = (route: string, query: ParsedUrlQueryInput = {}): void => {
    setIsPortfolioOpen(false);
    setIsMenuOpen(false);
    push({ pathname: route, query: query });
  };

  const getFontColor = (): string => {
    if (isLandingPage) {
      return COLORS.CLEAR;
    } else if (isDarkMode) {
      return COLORS.CLEAR;
    } else {
      return COLORS.GREY_800;
    }
  };

  const submitSearch = (e: FormEvent): void => {
    e.preventDefault();
    if (!search.trim()) return;
    redirectTo(`/search`, { value: search });
    setSearch("");
  };

  useClickOutside(containerRef, () => setIsMenuOpen(false));
  useClickOutside(portfolioDropdownRef, () => setIsPortfolioOpen(false));
  useClickOutside(userDropdownRef, () => setIsUserMenuOpen(false));

  return (
    <Fragment>
      <Container isOpen={isMenuOpen} isLandingPage={isLandingPage} ref={containerRef}>
        <MenuIcon color={getFontColor()} onClick={() => setIsMenuOpen(!isMenuOpen)} size={25} />
        {!isAuthenticated && (
          <Tab onClick={() => redirectTo("/")} isLandingPage={isLandingPage} isOpen={isMenuOpen}>
            Home
          </Tab>
        )}
        {isAuthenticated && (
          <Dropdown isLandingPage={isLandingPage} isOpen={isMenuOpen} ref={portfolioDropdownRef}>
            <DropdownButton onClick={() => setIsPortfolioOpen(!isPortfolioOpen)}>
              <DropdownLabel isLandingPage={isLandingPage}>Portfolio</DropdownLabel>
              <FiChevronDown color={getFontColor()} />
            </DropdownButton>
            <DropdownArea position="left" isLandingPage={isLandingPage} isOpen={isPortfolioOpen}>
              <DropdownItem onClick={() => redirectTo("/portfolio/dashboard")}>NFT Dashboard</DropdownItem>
              <DropdownItem onClick={() => redirectTo("/portfolio/collection")}>Your Collection</DropdownItem>
              <DropdownItem onClick={() => redirectTo("/portfolio/mulletswap")}>MulletSwap</DropdownItem>
            </DropdownArea>
          </Dropdown>
        )}
        <Tab onClick={() => redirectTo("/marketplace")} isLandingPage={isLandingPage} isOpen={isMenuOpen}>
          Marketplace
        </Tab>
        <Search isOpen={isMenuOpen} onSubmit={submitSearch}>
          <SearchIcon color={getFontColor()} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            isLandingPage={isLandingPage}
            placeholder="Search items, collections, and accounts"
          />
        </Search>
        <Tab onClick={() => redirectTo("/leaderboard")} isLandingPage={isLandingPage} isOpen={isMenuOpen}>
          Leaderboard
        </Tab>
        {!isAuthenticated && (
          <Tab onClick={openAuthModal} isLandingPage={isLandingPage} isOpen={isMenuOpen}>
            Sign In
          </Tab>
        )}
        {isAuthenticated && (
          <Dropdown isLandingPage={isLandingPage} isOpen={isMenuOpen} ref={userDropdownRef}>
            <DropdownButton onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
              <UserWrapper isOpen={isMenuOpen}>
                <Blockie seed={user?.get("ethAddress")} scale={3} />
                <UserAddress isLandingPage={isLandingPage}>{getDisplayName(user?.get("ethAddress"))}</UserAddress>
                <FiChevronDown color={getFontColor()} />
              </UserWrapper>
            </DropdownButton>
            <DropdownArea position="right" isLandingPage={isLandingPage} isOpen={isUserMenuOpen}>
              <DropdownItem onClick={() => redirectTo("/")}>Create</DropdownItem>
              <DropdownItem onClick={() => redirectTo("/settings")}>Settings</DropdownItem>
              <DropdownItem onClick={logout}>Logout</DropdownItem>
            </DropdownArea>
          </Dropdown>
        )}
      </Container>
      <WalletModal moralisAuth={true} isOpened={isConnectModalOpen} setIsOpened={setIsConnectModalOpen} />
    </Fragment>
  );
}

export default Header;
