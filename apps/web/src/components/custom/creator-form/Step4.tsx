import React from "react";


const Step4 = ({ data, updateFieldHandler }) => {
  return (
    <div >
      <h2>Informe o endereço de sua acomodação</h2>
      <div>
        <div>
          <h2>Endereço</h2>
          <input
            type="text"
            name="address"
            placeholder="Digite o endereço da acomodação"
            value={data.address || ""}
            onChange={(e) =>
              updateFieldHandler({
                target: { name: "address", value: e.target.value },
              })
            }
          />
        </div>
        <div>
          <h2>Bairro/Distrito</h2>
          <input
            type="text"
            name="neighborhood"
            placeholder="Digite a cidade da sua acomodação"
            value={data.neighborhood || ""}
            onChange={(e) =>
              updateFieldHandler({
                target: { name: "neighborhood", value: e.target.value },
              })
            }
          />
        </div>
        <div>
          <h2>Cidade</h2>
          <input
            type="text"
            name="city"
            placeholder="Digite o bairro/distrito da sua acomodação"
            value={data.city || ""}
            onChange={(e) =>
              updateFieldHandler({
                target: { name: "city", value: e.target.value },
              })
            }
          />
        </div>
        <div>
          <h2>UF</h2>
          <input
            type="text"
            name="uf"
            value={data.uf || ""}
            placeholder="Digite o estado/província da sua acomodação"
            onChange={(e) =>
              updateFieldHandler({
                target: { name: "uf", value: e.target.value },
              })
            }
          />
        </div>
        <div>
          <h2>CEP</h2>
          <input
            type="text"
            name="postal_code"
            placeholder="Digite o CEP da sua acomodação"
            value={data.postal_code || ""}
            onChange={(e) =>
              updateFieldHandler({
                target: { name: "postal_code", value: e.target.value },
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Step4;
