import { useEffect, useRef, useState } from "react"
import CodeEditor from "./components/CodeEditor"
import { cn } from "./lib/utils"
import { fonts, themes } from "./options"
import useStore from "./store"
import ExportOptions from "./components/controls/ExportOptions"
import ThemeSelect from "./components/controls/ThemeSelect"
import LanguageSelect from "./components/controls/LanguageSelect"
import FontSelect from "./components/controls/FontSelect"
import FontSizeInput from "./components/controls/FontSizeInput"
import BackgroundSwitch from "./components/controls/BackgroundSwitch"
import DarkModeSwitch from "./components/controls/DarkModeSwitch"
import { Resizable } from "re-resizable"
import { Button } from "./components/ui/button"
import { ResetIcon } from "@radix-ui/react-icons"
import WidthMeasurement from "./components/WidthMeasurement"

function App() {
  const [width, setWidth] = useState("auto")
  const [showWidth, setShowWidth] = useState(false)

  const theme = useStore((state) => state.theme)
  const padding = useStore((state) => state.padding)
  const fontStyle = useStore((state) => state.fontStyle)
  const showBackground = useStore((state) => state.showBackground)

  const editorRef = useRef(null)

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    if (queryParams.size === 0) return
    const state = Object.fromEntries(queryParams)

    useStore.setState({
      ...state,
      code: state.code ? atob(state.code) : "",
      autoDetectLanguage: state.autoDetectLanguage === "true",
      darkMode: state.darkMode === "true",
      fontSize: Number(state.fontSize || 18),
      padding: Number(state.padding || 64),
    })
  }, [])

  return (
    <main className="dark min-h-screen flex justify-center items-center bg-neutral-950 text-white">
      <link
        rel="stylesheet"
        href={themes[theme].theme}
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href={fonts[fontStyle].src}
        crossOrigin="anonymous"
      />

      {/* Floating Sidebar */}
      <div className="fixed left-4 top-4 bottom-4 w-64 bg-neutral-900/50 backdrop-blur-md rounded-lg shadow-lg overflow-hidden">
        <div className="h-full overflow-y-auto px-4 py-6 flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-center mb-4">Code Editor Settings</h2>
          <ThemeSelect />
          <LanguageSelect />
          <FontSelect />
          <FontSizeInput />

          <BackgroundSwitch />
          <DarkModeSwitch />
          <div className="w-full h-px bg-neutral-700 my-2" />
          <ExportOptions targetRef={editorRef} />
        </div>
      </div>

      {/* Main Content */}
      <Resizable
        enable={{ left: true, right: true }}
        minWidth={padding * 2 + 400}
        size={{ width }}
        onResize={(e, dir, ref) => setWidth(ref.offsetWidth)}
        onResizeStart={() => setShowWidth(true)}
        onResizeStop={() => setShowWidth(false)}
      >
        <div
          className={cn(
            "overflow-hidden mb-2 transition-all ease-out",
            showBackground ? themes[theme].background : "ring ring-neutral-900"
          )}
          style={{ padding }}
          ref={editorRef}
        >
          <CodeEditor />
        </div>
        <WidthMeasurement showWidth={showWidth} width={width} />
        <div
          className={cn(
            "transition-opacity w-fit mx-auto -mt-4",
            showWidth || width === "auto"
              ? "invisible opacity-0"
              : "visible opacity-100"
          )}
        >
          <Button size="sm" onClick={() => setWidth("auto")} variant="ghost">
            <ResetIcon className="mr-2" />
            Reset width
          </Button>
        </div>
      </Resizable>
    </main>
  )
}

export default App