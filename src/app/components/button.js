import './button.css';

const Button = ({children, classname, style, onClick}) => {
  return (
    <button 
        className={`btn ${classname}`} 
        style={style} 
        onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;