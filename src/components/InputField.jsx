import '@scss/index.scss';

function InputField(props) {
  return (
    <>
      <div className='label-div'>
        <label htmlFor={props.id}>{props.label}</label>
      </div>
      <div className='input-div'>
        <input
          type={props.type}
          id={props.id}
          name={props.name}
          value={props.value}
          placeholder={props.placeholder}
          onChange={props.handleOnChange}
          onFocus={props.handleOnInputFocus}
          className={props.className}
          onKeyDown={props.handleOnInputKeyDown}
        />
      </div>
    </>
  );
}

export default InputField;
