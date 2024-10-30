import { cn } from "@/lib/utils"
import { codeSnippets, fonts } from "@/options"
import useStore from "@/store"
import flourite from "flourite"
import hljs from "highlight.js"
import { useEffect, useState } from "react"
import Editor from "react-simple-code-editor"

export default function CodeEditor() {
  const store = useStore()
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const randomSnippet =
      codeSnippets[Math.floor(Math.random() * codeSnippets.length)]
    useStore.setState(randomSnippet)
  }, [])

  useEffect(() => {
    if (store.autoDetectLanguage) {
      const { language } = flourite(store.code, { noUnknown: true })
      useStore.setState({
        language: language.toLowerCase() || "plaintext",
      })
    }
  }, [store.autoDetectLanguage, store.code])

  return (
    <div className="w-full">
      <div
        className={cn(
          "border rounded shadow-md overflow-hidden",
          "min-w-[280px] max-w-full",
          store.darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-300"
        )}
      >
        <header className="flex items-center justify-between px-2 sm:px-4 py-2 border-b border-gray-300 dark:border-gray-700">
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={store.title}
              onChange={(e) => useStore.setState({ title: e.target.value })}
              spellCheck={false}
              onClick={(e) => e.target.select()}
              className="bg-transparent w-full text-xs sm:text-sm font-medium focus:outline-none truncate"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
            <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>
        {!isCollapsed && (
          <div
            className={cn(
              "px-2 sm:px-4 py-2 overflow-x-auto",
              store.darkMode
                ? "text-gray-300"
                : "text-gray-800"
            )}
          >
            <Editor
              value={store.code}
              onValueChange={(code) => {
                useStore.setState({ code })
              }}
              highlight={(code) =>
                hljs.highlight(code, { language: store.language || "plaintext" })
                  .value
              }
              style={{
                fontFamily: fonts[store.fontStyle].name,
                fontSize: Math.min(store.fontSize, 16),
                lineHeight: '1.5',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                maxWidth: '100%'
              }}
              textareaClassName="focus:outline-none w-full"
              onClick={(e) => e.target.select()}
            />
          </div>
        )}
      </div>
    </div>
  )
}