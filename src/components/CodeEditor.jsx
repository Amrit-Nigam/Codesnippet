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
    <div
      className={cn(
        "min-w-[400px] border rounded shadow-md",
        store.darkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-300"
      )}
    >
      <header className="flex items-center px-4 py-3 border-b border-gray-300 dark:border-gray-700">
        <div className="flex-grow">
          <input
            type="text"
            value={store.title}
            onChange={(e) => useStore.setState({ title: e.target.value })}
            spellCheck={false}
            onClick={(e) => e.target.select()}
            className="bg-transparent w-full text-sm font-medium focus:outline-none"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>
      {!isCollapsed && (
        <div
          className={cn(
            "px-4 py-4",
            store.darkMode
              ? "text-gray-300"
              : "text-gray-800"
          )}
        >
          <Editor
            value={store.code}
            onValueChange={(code) => useStore.setState({ code })}
            highlight={(code) =>
              hljs.highlight(code, { language: store.language || "plaintext" })
                .value
            }
            style={{
              fontFamily: fonts[store.fontStyle].name,
              fontSize: store.fontSize,
            }}
            textareaClassName="focus:outline-none"
            onClick={(e) => e.target.select()}
          />
        </div>
      )}
    </div>
  )
}