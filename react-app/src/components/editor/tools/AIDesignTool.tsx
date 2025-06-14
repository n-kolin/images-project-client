import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../../../store/store"
import { clearError, generateDesign } from "../../../store/aiDesignSlice"
import "../../../css/AIDesignTool.css"

const AIDesignTool = () => {
  const [prompt, setPrompt] = useState("")
  const [submittedPrompt, setSubmittedPrompt] = useState("")
  const [showMessage, setShowMessage] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const dispatch = useDispatch<AppDispatch>()

  const { loading, error, imageState } = useSelector((state: StoreType) => state.aiDesign)

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.max(44, textarea.scrollHeight)}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [prompt])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setSubmittedPrompt(prompt)
    setShowMessage(true)

    dispatch(clearError())

    const request = {
      prompt,
      currentState: {
        filters: imageState.filters,
      },
      imageParams: {
        width: 500,
        height: 500,
        format: "jpg",
      },
    }

    dispatch(generateDesign(request))
      .then(() => {
        setPrompt("")
        if (textareaRef.current) {
          textareaRef.current.style.height = "44px"
        }
        setTimeout(() => {
          setShowMessage(false)
        }, 3500)
      })
      .catch((error) => {
        console.error("Error in AI request:", error)
        setTimeout(() => {
          setShowMessage(false)
        }, 3500)
      })
  }

  return (<>
    <div className="image-editor-header">
      <h1 >Image Editor</h1>
    </div>
    <div className="ai-design-tool">

      <h3 className="ai-tool-title">AI Design Tool</h3>

      {showMessage && <div className={`chat-message ${showMessage ? "show" : ""}`}>{submittedPrompt}</div>}

      <form onSubmit={handleSubmit} className="ai-form">
        <div className="input-container">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Describe the changes you want (e.g., 'add a thin pink border')"
            className="ai-textarea"
            rows={3}
          />
        </div>


        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className={`ai-submit-button ${loading ? "loading" : ""}`}
        >
          {loading ? "Processing..." : "Apply Design"}
        </button>
      </form>
    </div>
  </>)
}

export default AIDesignTool

