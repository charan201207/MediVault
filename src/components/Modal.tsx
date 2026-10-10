import { useEffect, useId, useRef } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { X } from 'lucide-react'

type ModalProps = {
  title: string
  size?: 'sm' | 'md' | 'lg'
  onClose: () => void
  children: ReactNode
}

// Uses the browser's native <dialog>: focus is trapped and Escape closes it.
export default function Modal({ title, size = 'md', onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openerRef = useRef<Element | null>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return undefined
    if (!openerRef.current) openerRef.current = document.activeElement
    if (!dialog.open) dialog.showModal()
    dialog.querySelector<HTMLElement>('[data-autofocus]')?.focus()
    return () => {
      if (openerRef.current instanceof HTMLElement) openerRef.current.focus()
    }
  }, [])

  function handleClick(event: MouseEvent<HTMLDialogElement>) {
    // Only the dark backdrop has the dialog itself as the click target.
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <dialog ref={dialogRef} className={`modal modal-${size}`} aria-labelledby={titleId} onClose={onClose} onClick={handleClick}>
      <div className="modal-panel">
        <div className="modal-header">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  )
}

type ConfirmDialogProps = {
  title: string
  confirmLabel: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
  children: ReactNode
}

export function ConfirmDialog({ title, confirmLabel, danger = false, onConfirm, onCancel, children }: ConfirmDialogProps) {
  return (
    <Modal title={title} size="sm" onClose={onCancel}>
      <div className="modal-body">{children}</div>
      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} data-autofocus>
          Cancel
        </button>
        <button type="button" className={danger ? 'btn btn-danger' : 'btn btn-primary'} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}