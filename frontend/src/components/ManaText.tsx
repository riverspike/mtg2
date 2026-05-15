import { memo } from 'react'
import { MANA_SYMBOLS } from '../utils/manaSymbols'

interface Props {
  text: string | null | undefined
  size?: number
}

export default memo(function ManaText({ text, size = 16 }: Props) {
  if (!text) return null

  const parts = text.split(/(\{[^}]+\})/)

  return (
    <span className="mana-text">
      {parts.map((part, i) => {
        const match = part.match(/^\{([^}]+)\}$/)
        if (match) {
          const src = MANA_SYMBOLS[match[1]]
          if (src) {
            return (
              <img
                key={i}
                src={src}
                alt={part}
                title={part}
                className="mana-icon"
                style={{ width: size, height: size }}
              />
            )
          }
          return <span key={i} className="mana-unknown">{part}</span>
        }
        return part ? <span key={i}>{part}</span> : null
      })}
    </span>
  )
})
