import React, { Fragment, useState, useRef, FormEvent, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { Blockie, Checkbox, WalletModal } from "web3uikit";
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
  Logo,
  LogoDrawerWrapper,
  MarketplaceTab,
  ProfilePicture,
  NightSwitch,
} from "./HeaderStyled";
import StoreType from "../../types/StoreType";
import { useSelector } from "react-redux";
import { ParsedUrlQueryInput } from "querystring";
import { useDispatch } from "react-redux";
import { clearStore, getAccount } from "../../config/accountSlice";
import { AppDispatch } from "../../config/store";
import { switchTheme } from "../../config/themeSlice";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { isAuthenticated, user, logout: moralisLogout, isInitialized } = useMoralis();
  const { pathname, push } = useRouter();
  const containerRef = useRef<HTMLElement>(null);
  const marketplaceDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const isLandingPage = pathname === "/";
  const { isDarkMode } = useSelector((store: StoreType) => store.theme);
  const { imageUrl, username } = useSelector((store: StoreType) => store.account);
  const dispatch = useDispatch<AppDispatch>();

  const logout = () => {
    moralisLogout();
    dispatch(clearStore());
  };

  const openAuthModal = () => {
    setIsConnectModalOpen(true);
    setIsMenuOpen(false);
  };

  const redirectTo = (route: string, query: ParsedUrlQueryInput = {}): void => {
    setIsMarketplaceOpen(false);
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
  useClickOutside(marketplaceDropdownRef, () => setIsMarketplaceOpen(false));
  useClickOutside(userDropdownRef, () => setIsUserMenuOpen(false));

  useEffect(() => {
    if (isInitialized && user) {
      dispatch(getAccount(user?.get("ethAddress")));
    }
  }, [user, dispatch, isInitialized]);

  return (
    <Fragment>
      <Container isOpen={isMenuOpen} isLandingPage={isLandingPage} ref={containerRef}>
        <LogoDrawerWrapper>
          <Logo onClick={() => redirectTo("/")} />
          <MenuIcon color={getFontColor()} onClick={() => setIsMenuOpen(!isMenuOpen)} size={25} />
        </LogoDrawerWrapper>
        {!isAuthenticated && (
          <MarketplaceTab onClick={() => redirectTo("/marketplace")} isLandingPage={isLandingPage} isOpen={isMenuOpen}>
            Marketplace
          </MarketplaceTab>
        )}
        {isAuthenticated && (
          <Dropdown isLandingPage={isLandingPage} isOpen={isMenuOpen} ref={marketplaceDropdownRef}>
            <DropdownButton onClick={() => setIsMarketplaceOpen(!isMarketplaceOpen)}>
              <MarketplaceTab isLandingPage={isLandingPage} isOpen={isMenuOpen}>
                <DropdownLabel isLandingPage={isLandingPage}>Marketplace</DropdownLabel>
                <FiChevronDown color={getFontColor()} />
              </MarketplaceTab>
            </DropdownButton>
            <DropdownArea position="left" isLandingPage={isLandingPage} isOpen={isMarketplaceOpen}>
              <DropdownItem onClick={() => redirectTo("/marketplace")}>Marketplace</DropdownItem>
              <DropdownItem onClick={() => redirectTo("/marketplace/minters")}>Minters Market</DropdownItem>
              <DropdownItem onClick={() => redirectTo("/marketplace/mulletswap")}>MulletSwap</DropdownItem>
            </DropdownArea>
          </Dropdown>
        )}
        <Tab onClick={() => redirectTo("/leaderboard")} isLandingPage={isLandingPage} isOpen={isMenuOpen}>
          Leaderboard
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
        <Tab onClick={() => redirectTo("/create")} isLandingPage={isLandingPage} isOpen={isMenuOpen}>
          Create
        </Tab>
        <Tab
          onClick={() => redirectTo(`/profile/${user?.get("ethAddress")}`)}
          isLandingPage={isLandingPage}
          isOpen={isMenuOpen}
        >
          Profile
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
                {imageUrl ? (
                  <ProfilePicture style={{ backgroundImage: `url(${imageUrl})` }} />
                ) : (
                  <Blockie seed={user?.get("ethAddress")} scale={3} />
                )}
                <UserAddress isLandingPage={isLandingPage}>
                  {username || getDisplayName(user?.get("ethAddress"))}
                </UserAddress>
                <FiChevronDown color={getFontColor()} />
              </UserWrapper>
            </DropdownButton>
            <DropdownArea position="right" isLandingPage={isLandingPage} isOpen={isUserMenuOpen}>
              <DropdownItem onClick={() => redirectTo("/settings")}>Settings</DropdownItem>
              <DropdownItem onClick={() => redirectTo("/account")}>Account</DropdownItem>
              <DropdownItem>
                <NightSwitch>
                  <span onClick={() => dispatch(switchTheme())}>Night Mode</span>
                  <Checkbox
                    layout="switch"
                    checked={isDarkMode}
                    label="&nbsp;"
                    name="dark-mode"
                    onChange={() => dispatch(switchTheme())}
                  />
                </NightSwitch>
              </DropdownItem>
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
