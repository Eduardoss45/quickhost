import "./Step7.css";

const Step7 = () => {
  return (
    <div id="step-seven">
      <h2>Hora de adicionar um título à sua acomodação</h2>
      <div id="step-seven-title">
        <input type="text" name="" id="" placeholder="Digite aqui seu título" />
        <span className="cont-letras">0/32</span>
      </div>
      <h2>Crie sua descrição</h2>
      <div id="step-seven-description">
        <textarea
          name=""
          id=""
          placeholder="Digite aqui sua descrição"
        ></textarea>
        <span className="cont-letras">0/400</span>
      </div>
      <p>Você poderá fazer alterações depois.</p>
    </div>
  );
};

export default Step7;
