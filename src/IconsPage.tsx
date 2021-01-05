import { useState } from "react";
import styled from "styled-components";
import { AwesomeIconPicker } from "./AwesomeIconPicker/AwesomeIconPicker";
import { Icon } from "./AwesomeIconPicker/icon-defintion";

export const IconsPage = () => {
  const [value, setValue] = useState<Icon | null>(null);

  return (
    <SWrapper>
      <AwesomeIconPicker onChange={setValue} value={value} />
    </SWrapper>
  );
};

const SWrapper = styled.div`
  margin: auto;
  max-width: 960px;
  padding: 16px;
`;
