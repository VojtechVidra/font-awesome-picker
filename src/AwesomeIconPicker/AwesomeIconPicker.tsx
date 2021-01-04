import {
  library,
  dom,
  IconPrefix,
  IconName,
} from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, OutlinedInput, Popover } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import { useCallback, useEffect, useMemo, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import styled from "styled-components";
import { FontAwesomeIconStyle, IconDefinitions } from "./icon-defintion";
import Fuse from "fuse.js";

const PAGE_SIZE = 49;
const ICON_SIZE = "3x";

export type Icon = [IconPrefix, IconName];

interface Props {
  value: Icon | null;
  onChange(value: Icon | null): void;
  color?: string;
}

export const AwesomeIconPicker = ({ onChange, value, color }: Props) => {
  //#region - Page
  const [page, setPage] = useState(0);
  const handleChangePage = useCallback(
    (_: React.ChangeEvent<unknown>, page: number) => setPage(page - 1),
    [setPage]
  );
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
  const filteredDefs = useMemo(() => {
    if (!query) return freeIconsDefinition;

    const result = fuse.search(query);
    return result.map((i) => i.item);
  }, [query, fuse, freeIconsDefinition]);
  const currentPageResults = useMemo(
    () => filteredDefs.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [filteredDefs, page]
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

  const pageCount = useMemo(() => Math.ceil(filteredDefs.length / PAGE_SIZE), [
    filteredDefs,
  ]);

  return (
    <SWrapper>
      <SIconWrapper onClick={handleOpenPopover}>
        {value ? (
          <FontAwesomeIcon
            size={ICON_SIZE}
            icon={value as Icon}
            color={color}
          />
        ) : (
          "-"
        )}
      </SIconWrapper>
      <Popover
        onClose={handleClosePopover}
        open={!!anchorEl}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <SPopoverContentWrapper>
          <OutlinedInput
            margin="dense"
            fullWidth
            value={query}
            onChange={(e) => handleChangeQuery(e.target.value)}
            endAdornment={
              <IconButton onClick={handleClearSearch}>
                <Close />
              </IconButton>
            }
          />
          <SIconsList>
            {currentPageResults.map((def) => (
              <SIconWrapper
                key={def.icon.join(":")}
                onClick={() => handleSelectIcon(def.icon)}
              >
                <FontAwesomeIcon
                  size={ICON_SIZE}
                  icon={def.icon as Icon}
                  color={color}
                />
              </SIconWrapper>
            ))}
          </SIconsList>
          <Pagination
            page={page + 1}
            onChange={handleChangePage}
            count={pageCount}
          />
        </SPopoverContentWrapper>
      </Popover>
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

const SIconWrapper = styled.div`
  padding: 8px;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.26);
  border-radius: 8px;
  box-sizing: border-box;
  transition: all 0.16s;
  cursor: pointer;
  font-size: 24px;

  :hover {
    background-color: #eee;
  }

  svg {
    max-width: 100%;
    max-height: 100%;
  }
`;

const SIconsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 560px;
  margin: 0 -8px;

  ${SIconWrapper} {
    margin: 8px;
  }
`;

const SPopoverContentWrapper = styled.div`
  padding: 8px;
`;

function getPrefix(style: FontAwesomeIconStyle): IconPrefix | undefined {
  switch (style) {
    case "brands":
      return "fab";
    case "solid":
      return "fas";
  }
}
