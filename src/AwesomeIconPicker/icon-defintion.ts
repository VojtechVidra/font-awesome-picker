import { IconName, IconPrefix } from "@fortawesome/fontawesome-svg-core";

export type FontAwesomeIconStyle =
  | "brands"
  | "solid"
  | "regular"
  | "light"
  | "duotone";

export interface FontIconDefinition {
  changes: string[];
  label: string;
  search: {
    terms: string[];
  };
  styles: FontAwesomeIconStyle[];
  unicode: string;
  voted?: boolean;
  ligatures?: string[];
  private?: boolean;
}

export type IconDefinitions = Record<string, FontIconDefinition>;

export type Icon = [IconPrefix, IconName];
