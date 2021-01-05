import {
  library,
  dom,
  IconPrefix,
  IconName,
} from "@fortawesome/fontawesome-svg-core";
import { IconButton, OutlinedInput } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import styled from "styled-components";
import { FontAwesomeIconStyle, Icon, IconDefinitions } from "./icon-defintion";
import Fuse from "fuse.js";
import { IconTile } from "./IconTile";
import { PopoverPicker } from "./PopoverPicker";

const PAGE_SIZE = 49;
const ICON_SIZE = "3x";

interface Props {
  value: Icon | null;
  onChange(value: Icon | null): void;
  color?: string;
}

export const AwesomeIconPicker = ({ onChange, value, color }: Props) => {
  //#region - Page
  const [page, setPage] = useState(0);
  //#endregion

  //#region - Search
  const [query, setQuery] = useState("");
  const handleClearSearch = useCallback(() => {
    setQuery("");
  }, [setQuery]);
  const handleChangeQuery = useCallback(
    (query = "") => {
      unstable_batchedUpdates(() => {
        setQuery(query);
        setPage(0);
      });
    },
    [setQuery, setPage]
  );
  //#endregion

  //#region - Popover state
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const handleOpenPopover = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => setAnchorEl(e.currentTarget),
    [setAnchorEl]
  );
  const handleClosePopover = useCallback(() => setAnchorEl(null), [
    setAnchorEl,
  ]);
  //#endregion

  //#region - Loading results
  const [iconsDefinition, setIconsDefinition] = useState<IconDefinitions>();
  useEffect(() => {
    (async () => {
      Promise.all([
        import("./icons-definition"),
        import("@fortawesome/free-solid-svg-icons"),
        import("@fortawesome/free-brands-svg-icons"),
      ]).then(([{ iconsDefinition }, { fas }, { fab }]) => {
        library.add(fas, fab);
        dom.watch();
        setIconsDefinition(iconsDefinition);
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const freeIconsDefinition = useMemo(
    () =>
      Object.entries(iconsDefinition ?? {}).reduce<
        {
          search: string;
          icon: Icon;
        }[]
      >((acc, [key, value]) => {
        value.styles.forEach((style) => {
          let prefix = getPrefix(style);
          if (!prefix) return;

          acc.push({
            icon: [prefix as IconPrefix, key as IconName],
            search: [key, value.label, ...value.search.terms].join(" "),
          });
        });

        return acc;
      }, []),
    [iconsDefinition]
  );
  const fuse = useMemo(
    () =>
      new Fuse(freeIconsDefinition, {
        keys: ["search"],
        threshold: 0.4,
        distance: 100,
      }),
    [freeIconsDefinition]
  );
  const filteredIcons = useMemo(() => {
    if (!query) return freeIconsDefinition.map((def) => def.icon);

    const result = fuse.search(query);
    return result.map((i) => i.item.icon);
  }, [query, fuse, freeIconsDefinition]);
  const currentPageResults = useMemo(
    () => filteredIcons.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [filteredIcons, page]
  );
  //#endregion

  //#region - Value
  const handleSelectIcon = useCallback(
    (value: Icon) => {
      unstable_batchedUpdates(() => {
        onChange(value);
        handleClosePopover();
      });
    },
    [onChange, handleClosePopover]
  );
  const handleRemoveValue = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(null);
    },
    [onChange]
  );
  //#endregion

  const pageCount = useMemo(() => Math.ceil(filteredIcons.length / PAGE_SIZE), [
    filteredIcons,
  ]);

  return (
    <SWrapper>
      <IconTile
        icon={value as Icon | undefined}
        size={ICON_SIZE}
        color={color}
        onClick={handleOpenPopover}
      />
      <PopoverPicker
        anchorEl={anchorEl}
        open={!anchorEl}
        onChangePage={setPage}
        onChangeQuery={handleChangeQuery}
        onClearQuery={handleClearSearch}
        onClickIcon={handleSelectIcon}
        onClose={handleClosePopover}
        page={page + 1}
        pageCount={pageCount}
        query={query}
        results={currentPageResults}
        iconColor={color}
        iconSize={ICON_SIZE}
      />
      <SInputWrapper>
        <OutlinedInput
          margin="dense"
          onClick={handleOpenPopover}
          disabled
          value={value ? `${value[0]} fa-${value[1]}` : "-"}
          endAdornment={
            <IconButton disabled={!value} onClick={handleRemoveValue}>
              <Close />
            </IconButton>
          }
        />
      </SInputWrapper>
    </SWrapper>
  );
};

const SWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const SInputWrapper = styled.div`
  padding-left: 16px;
`;

function getPrefix(style: FontAwesomeIconStyle): IconPrefix | undefined {
  switch (style) {
    case "brands":
      return "fab";
    case "solid":
      return "fas";
  }
}
