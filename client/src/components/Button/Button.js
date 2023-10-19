import "./Button.css";

const Button = ({ type, text, onClickEvent,style }) => {
  return (
    <button type={type} className="app-button-component" onClick={onClickEvent} style={style}>
      {text}
    </button>
  );
};

export default Button;
