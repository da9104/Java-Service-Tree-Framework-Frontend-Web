import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";
import Editor from "./pages/Editor";
import Survey from "./pages/Survey";
import BugReport from "./pages/BugReport";
import Shortcuts from "./pages/Shortcuts";
import Templates from "./pages/Templates";
import LandingPage from "./pages/LandingPage";
import SettingsContextProvider from "./context/SettingsContext";
import { useSettings } from "./hooks";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <SettingsContextProvider>
      <BrowserRouter>
        <RestoreScroll />
        <Routes>
          <Route path="/reference/drawdb/" element={<LandingPage />} />
          <Route
            path="/reference/drawdb/editor"
            element={
              <ThemedPage>
                <Editor />
              </ThemedPage>
            }
          />
          <Route
            path="/reference/drawdb/survey"
            element={
              <ThemedPage>
                <Survey />
              </ThemedPage>
            }
          />
          <Route
            path="/reference/drawdb/shortcuts"
            element={
              <ThemedPage>
                <Shortcuts />
              </ThemedPage>
            }
          />
          <Route
            path="/reference/drawdb/bug-report"
            element={
              <ThemedPage>
                <BugReport />
              </ThemedPage>
            }
          />
          <Route path="/reference/drawdb/templates" element={<Templates />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </SettingsContextProvider>
  );
}

function ThemedPage({ children }) {
  const { setSettings } = useSettings();

  useLayoutEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setSettings((prev) => ({ ...prev, mode: "dark" }));
      const body = document.body;
      if (body.hasAttribute("theme-mode")) {
        body.setAttribute("theme-mode", "dark");
      }
    } else {
      setSettings((prev) => ({ ...prev, mode: "light" }));
      const body = document.body;
      if (body.hasAttribute("theme-mode")) {
        body.setAttribute("theme-mode", "light");
      }
    }
  }, [setSettings]);

  return children;
}

function RestoreScroll() {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scroll(0, 0);
  }, [location.pathname]);
  return null;
}
