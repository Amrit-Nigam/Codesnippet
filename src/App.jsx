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
import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons"

function App() {
  const [width, setWidth] = useState("auto")
  const [showWidth, setShowWidth] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    <main className="dark min-h-screen bg-neutral-950 text-white">
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

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
      >
        {isMobileMenuOpen ? (
          <Cross1Icon className="w-6 h-6" />
        ) : (
          <HamburgerMenuIcon className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on desktop, sliding on mobile */}
      <div className={cn(
        "fixed lg:w-72 bg-neutral-900/50 backdrop-blur-md shadow-lg overflow-hidden z-40",
        // Desktop styles
        "lg:left-4 lg:top-4 lg:bottom-4 lg:translate-x-0",
        // Mobile styles
        "w-[280px] top-0 bottom-0 transition-transform duration-300",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
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

      {/* Main Content Area */}
      <div className={cn(
        "min-h-screen transition-all duration-300",
        // Desktop styles
        "lg:pl-80 flex items-center justify-center",
        // Mobile styles
        "p-4 pt-16", // Added top padding for mobile to account for menu button
        isMobileMenuOpen ? "opacity-50" : "opacity-100"
      )}>
        <Resizable
          enable={{ left: true, right: true }}
          minWidth={Math.min(padding * 2 + 400, window.innerWidth - 32)}
          maxWidth={Math.min(1200, window.innerWidth - (window.innerWidth > 1024 ? 350 : 32))}
          size={{ width }}
          onResize={(e, dir, ref) => setWidth(ref.offsetWidth)}
          onResizeStart={() => setShowWidth(true)}
          onResizeStop={() => setShowWidth(false)}
          className="w-full lg:w-auto"
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
          {showWidth && (
            <div className="text-center text-sm text-neutral-500">
              {width}px
            </div>
          )}
        </Resizable>
      </div>
    </main>
  )
}

export default App