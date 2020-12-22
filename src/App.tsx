import { useState } from "react";
import { IconsPage } from "./IconsPage";

function App() {
  const [page, setPage] = useState<string>();

  return (
    <div>
      {(() => {
        switch (page) {
          case "icon":
            return <IconsPage />;
          default:
            return (
              <>
                <h1>Home page</h1>
                <p>Icons are loaded only after accessing "Icons page"</p>
                <button onClick={() => setPage("icon")}>Icons page</button>
              </>
            );
        }
      })()}
    </div>
  );
}

export default App;
