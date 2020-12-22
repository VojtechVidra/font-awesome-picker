import "@fonticonpicker/react-fonticonpicker/dist/fonticonpicker.base-theme.react.css";
import "@fonticonpicker/react-fonticonpicker/dist/fonticonpicker.material-theme.react.css";

import { dom, library } from "@fortawesome/fontawesome-svg-core";
import { useEffect, useMemo, useState } from "react";
import { IconDefinitions, FontAwesomeIconStyle } from "./types/icon-defintion";
// import Fuse from "fuse.js";
import styled from "styled-components";
import FontIconPicker from "@fonticonpicker/react-fonticonpicker";

const getPrefix = (style: FontAwesomeIconStyle) => {
  switch (style) {
    case "brands":
      return "fab";
    case "solid":
      return "fas";
  }
};

export const IconsPage = () => {
  const [iconsDefinition, setIconsDefinition] = useState<IconDefinitions>();
  // const [query, setQuery] = useState("");
  const [value, setValue] = useState("fas fa-truck");

  const freeIconsDefinition = useMemo(
    () =>
      Object.entries(iconsDefinition ?? {}).reduce<
        {
          search: string;
          icon: string;
        }[]
      >((acc, [key, value]) => {
        value.styles.forEach((style) => {
          let prefix = getPrefix(style);
          if (!prefix) return;

          acc.push({
            icon: `${prefix} fa-${key}`,
            search: [value.label, ...value.search.terms].join(" "),
          });
        });

        return acc;
      }, []),
    [iconsDefinition]
  );

  // const fuse = useMemo(
  //   () =>
  //     new Fuse(freeIconsDefinition, {
  //       keys: ["search", "icon"],
  //       includeScore: true,
  //       threshold: 0.4,
  //       distance: 10,
  //     }),
  //   [freeIconsDefinition]
  // );

  // const filteredDefs = useMemo(() => {
  //   if (!query) return freeIconsDefinition;

  //   const result = fuse.search(query);
  //   console.log({ result });
  //   return result.map((i) => i.item);
  // }, [query, fuse, freeIconsDefinition]);

  // console.log({ filteredDefs });

  useEffect(() => {
    (async () => {
      Promise.all([
        import("./data/icons-definition"),
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

  return (
    <SWrapper>
      {/* <div>
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </div> */}
      <FontIconPicker
        // icons={filteredDefs.map(d=>d.icon)}
        icons={freeIconsDefinition.map((d) => d.icon)}
        search={freeIconsDefinition.map((d) => d.search)}
        onChange={(v) => setValue(v)}
        value={value}
      />
    </SWrapper>
  );
};

const SWrapper = styled.div`
  margin: auto;
  max-width: 1200px;
  padding: 16px;
`;
