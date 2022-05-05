import ThemeType from "../types/themeType";
import COLORS from "./colors";

export const LIGHT: ThemeType = {
  PRIMARY: COLORS.PURPLE.DARK,
  BACKGROUND: COLORS.CLEAR,
  NAVIGATION: COLORS.WHITE,
  TEXT: COLORS.DARK,
};

const THEME = {
  LIGHT,
};

export const THEME_ENUM = {
  LIGHT: 0,
};

export default THEME;