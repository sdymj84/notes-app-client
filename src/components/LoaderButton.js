import React from 'react'
import { Button } from "react-bootstrap";
import { FiRefreshCw } from "react-icons/fi";
import './LoaderButton.css'

const LoaderButton = ({ isLoading, text, loadingText,
  disabled, ...rest }) => {
  return (
    <Button
      {...rest}
      className="LoaderButton"
      disabled={disabled || isLoading}
    >
      {isLoading
        ? <span><FiRefreshCw className="spinning" /> {loadingText}</span>
        : text}
    </Button>
  )
}

export default LoaderButton
