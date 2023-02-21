import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, FormGroup, FormLabel, FormText, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Field, ErrorMessage } from 'formik'
import { MdInfoOutline } from 'react-icons/md'; 

 export const TextInput = ({name, label, col=3, help, readOnly, disabled}) => (
  <>
   <Field name={name}>
      { ({field}) => (
        <FormGroup as={Row} controlId={"id_"+name}>
          <FormLabel column sm={col}>{label}</FormLabel>
          <Col sm={12-col}>
            <FormText className="text-danger"><ErrorMessage name={name} /></FormText>
            <FormControl 
              type={'text'}
              readOnly={readOnly ?? false} 
              disabled={disabled ?? false} 
              {...field}
            />
            { help ? <FormText>{help}</FormText> : null }
          </Col>
        </FormGroup>
      )}
    </Field>
  </>
)
TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  col: PropTypes.number,
  help: PropTypes.string,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
}

export const SelectInput = ({name, label, options, col=3, help, readOnly, disabled}) => {
  const optionItems = options.map( (option) => (
    <option key={option.id} value={option.id}>{option.label}</option> 
  ))
  return (
    <>
    <Field name={name}>
        { ({field}) => (
          <FormGroup as={Row} controlId={"id_"+name} >
            <FormLabel column sm={col}>{label}</FormLabel>
            <Col sm={12-col}>
              <FormText className="text-danger"><ErrorMessage name={name} /></FormText>
              <FormControl as="select" 
                readOnly={readOnly ?? false} 
                disabled={disabled ?? false} 
                {...field}
              >
                {optionItems}
              </FormControl>
              { help ? <FormText>{help}</FormText> : null }
            </Col>
          </FormGroup>
        )}
      </Field>
    </>
  )}

SelectInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  col: PropTypes.number,
  help: PropTypes.string,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
}

export const Info = ({item}) => {
  if (!item.help) return
  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 50, hide: 200 }}
      overlay={<Tooltip id={`tooltip-${item.key}`} className="tooltip">{item.help}</Tooltip>}
    >
      <span><MdInfoOutline /></span>
    </OverlayTrigger>
  )
}
Info.propTypes = {
  item: PropTypes.object,
}

// { item.help ? <FormText>{item.help}</FormText> : null }
export const TextInput2 = ({item, col=4}) => (
  <>
   <Field name={item.key}>
      { ({field}) => (
        <FormGroup as={Row} controlId={"id_"+item.key}>
          <FormLabel column sm={col} className="text-xs-start text-sm-end">{item.label} <Info item={item}/></FormLabel>
          <Col sm={12-col}>
            <FormText className="text-danger"><ErrorMessage name={item.key} /></FormText>
            <FormControl 
              type={item.type}
              readOnly={item.readOnly ?? false} 
              disabled={item.disabled ?? false} 
              {...field}
            />
          </Col>
        </FormGroup>
      )}
    </Field>
  </>
)
TextInput2.propTypes = {
  item: PropTypes.object.isRequired,
  col: PropTypes.number,
}

export const SelectInput2 = ({item, col=4}) => {
  const optionsMap = Object.entries(item.options)
  const options = optionsMap.map(([k, v]) => <option key={k} value={k}>{v}</option>)
  return (
    <>
    <Field name={item.key}>
        { ({field}) => (
          <FormGroup as={Row} controlId={"id_"+item.key} >
            <FormLabel column sm={col} className="text-xs-start text-sm-end">{item.label} { item.help ? <Info item={item}/> : null }</FormLabel>
            <Col sm={12-col}>
              <FormText className="text-danger"><ErrorMessage name={item.key} /></FormText>
              <FormControl as="select" 
                readOnly={item.readOnly ?? false} 
                disabled={item.disabled ?? false} 
                {...field}
              >
                {options}
              </FormControl>
            </Col>
          </FormGroup>
        )}
      </Field>
    </>
  )}

SelectInput2.propTypes = {
  item: PropTypes.object.isRequired,
  col: PropTypes.number,
}
