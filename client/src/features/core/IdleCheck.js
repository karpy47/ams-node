import React from 'react'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useIdleTimer } from 'react-idle-timer'
import { Modal, Button } from 'react-bootstrap'

export function IdleCheck(props) {

  const [remaining, setRemaining] = useState()
  const [show, setShow] = useState(false)

  const timeout = (props.timer ?? 600)*1000
  const promptBeforeIdle = Math.min(Math.round(timeout*0.2), 60)
  const timeoutInMin = Math.round(timeout/1000/60)

  const onIdle = () => {
    setShow(false)
  }

  const onActive = () => {
    setShow(false)
  }

  const onPrompt = () => {
    setShow(true)
  }

  const { getRemainingTime, activate } = useIdleTimer({
    onIdle,
    onActive,
    onPrompt,
    timeout,
    promptBeforeIdle,
    throttle: 500
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.ceil(getRemainingTime() / 1000))
    }, 500)

    return () => {
      clearInterval(interval)
    }
  })

  const handleClose = () => {
    setShow(false)
    activate()
  }

  return  (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Are you still here?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>You will be automatically logged out after {timeoutInMin} minutes of inactivity to protect personal data stored in the system. Click anywhere to stay logged in.</p>
        <p>Countdown to logout... {remaining}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>Stay logged in</Button>
      </Modal.Footer>
    </Modal>
  )
}

IdleCheck.propTypes = {
  timer: PropTypes.number,
}
