import React from "react";
import "./Step4.css";

const Step4 = ({ data, updateFieldHandler }) => {
  return (
    <div id="step-four">
      <h1>Informe o endereço de sua acomodação</h1>
      <div>
        <div>
          <input
            type="text"
            name="address"
            placeholder="Endereço"
            value={data.address || ""}
            onChange={(e) =>
              updateFieldHandler({
                target: { name: "address", value: e.target.value },
              })
            }
          />
        </div>
        <div>
          <input
            type="text"
            name="city"
            placeholder="Cidade"
            value={data.city || ""}
            onChange={(e) =>
              updateFieldHandler({
                target: { name: "city", value: e.target.value },
              })
            }
          />
        </div>
        <div>
          <input
            type="text"
            name="neighborhood"
            placeholder="Bairro"
            value={data.neighborhood || ""}
            onChange={(e) =>
              updateFieldHandler({
                target: { name: "neighborhood", value: e.target.value },
              })
            }
          />
        </div>
        <div>
          <input
            type="text"
            name="postal_code"
            placeholder="CEP"
            value={data.postal_code || ""}
            onChange={(e) =>
              updateFieldHandler({
                target: { name: "postal_code", value: e.target.value },
              })
            }
          />
        </div>
        <div>
          <input
            type="text"
            name="complement"
            placeholder="Complemento"
            value={data.complement || ""}
            onChange={(e) =>
              updateFieldHandler({
                target: { name: "complement", value: e.target.value },
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Step4;
