import { SizeProp } from "@fortawesome/fontawesome-svg-core";
import { IconButton, OutlinedInput, Popover } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import { useCallback } from "react";
import styled from "styled-components";
import { Icon } from "./icon-defintion";
import { IconTile } from "./IconTile";

interface Props {
  anchorEl: Element | null;
  open: boolean;
  onClose(): void;
  query: string;
  onChangeQuery(value: string): void;
  onClearQuery(): void;
  results: Icon[];
  iconSize?: SizeProp;
  iconColor?: string;
  page: number;
  pageCount: number;
  onChangePage(page: number): void;
  onClickIcon(icon: Icon): void;
}

export const PopoverPicker = ({
  anchorEl,
  onClose,
  open,
  query,
  onChangeQuery,
  onClearQuery,
  results,
  iconSize,
  iconColor,
  onChangePage,
  page,
  pageCount,
  onClickIcon,
}: Props) => {
  const handleChangeQuery = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChangeQuery(e.target.value),
    [onChangeQuery]
  );

  const handleChangePage = useCallback(
    (_, page: number) => onChangePage(page),
    [onChangePage]
  );

  return (
    <Popover
      onClose={onClose}
      open={open}
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
          onChange={handleChangeQuery}
          endAdornment={
            <IconButton onClick={onClearQuery}>
              <Close />
            </IconButton>
          }
        />
        <SIconsList>
          {results.map((icon) => (
            <SIconTile
              key={icon.join(":")}
              onClick={() => onClickIcon(icon)}
              size={iconSize}
              icon={icon}
              color={iconColor}
            />
          ))}
        </SIconsList>
        <Pagination page={page} onChange={handleChangePage} count={pageCount} />
      </SPopoverContentWrapper>
    </Popover>
  );
};

const SPopoverContentWrapper = styled.div`
  padding: 8px;
`;

const SIconsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 560px;
  margin: 0 -8px;
`;

const SIconTile = styled(IconTile)`
  margin: 8px;
`;
