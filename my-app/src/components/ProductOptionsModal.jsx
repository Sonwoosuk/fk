import { useState } from 'react'
import { metalOptions, getSizeOptions, formatWon } from '../lib/productOptions'
import './ProductOptionsModal.css'

export default function ProductOptionsModal({
  product,
  basePrice,
  initialMetalId = null,
  initialSize = null,
  title = '옵션을 선택해주세요',
  confirmLabel = '장바구니에 담기',
  onConfirm,
  onClose
}) {
  const sizeOptions = getSizeOptions(product)
  const [metal, setMetal] = useState(
    metalOptions.find((option) => option.id === initialMetalId) ?? null
  )
  const [size, setSize] = useState(initialSize)

  const needsSize = sizeOptions.length > 0
  const ready = Boolean(metal) && (!needsSize || Boolean(size))
  const finalPrice = basePrice + (metal?.surcharge ?? 0)

  return (
    <div className="options-modal-overlay" onClick={onClose}>
      <div
        className="options-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} 옵션 선택`}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="options-modal-close" aria-label="닫기" onClick={onClose}>
          ×
        </button>

        <p className="options-modal-kicker">{title}</p>
        <h2 className="options-modal-name">{product.name}</h2>

        <div className="options-modal-group">
          <p className="options-modal-label">Metal</p>
          <div className="options-modal-choices">
            {metalOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`options-modal-choice ${metal?.id === option.id ? 'selected' : ''}`}
                onClick={() => setMetal(option)}
              >
                <span>{option.label}</span>
                <span className="options-modal-surcharge">
                  {option.surcharge === 0
                    ? '기본가'
                    : `${option.surcharge > 0 ? '+' : '−'}${formatWon(Math.abs(option.surcharge))}`}
                </span>
              </button>
            ))}
          </div>
        </div>

        {needsSize && (
          <div className="options-modal-group">
            <p className="options-modal-label">Size</p>
            <div className="options-modal-choices options-modal-choices-row">
              {sizeOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`options-modal-choice ${size === option ? 'selected' : ''}`}
                  onClick={() => setSize(option)}
                >
                  <span>{option}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="options-modal-footer">
          <div className="options-modal-price">
            <span>Price</span>
            <strong>{formatWon(finalPrice)}</strong>
          </div>
          <button
            type="button"
            className="options-modal-confirm"
            disabled={!ready}
            onClick={() => onConfirm({ metal, size: needsSize ? size : null })}
          >
            {ready ? confirmLabel : '옵션을 선택해주세요'}
          </button>
        </div>
      </div>
    </div>
  )
}
