import { SizeProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HTMLAttributes } from "react";
import styled from "styled-components";
import { Icon } from "./icon-defintion";

interface Props extends HTMLAttributes<HTMLDivElement> {
  icon?: Icon;
  color?: string;
  size?: SizeProp;
}

export const IconTile = ({ icon, color, size, ...rest }: Props) => {
  return (
    <SIconWrapper {...rest}>
      {icon ? <FontAwesomeIcon size={size} icon={icon} color={color} /> : "-"}
    </SIconWrapper>
  );
};

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
