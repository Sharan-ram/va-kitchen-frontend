import Modal from "./Modal";

const PurchaseOrderModal = ({
  togglePurchaseOrder,
  targetRef,
  purchaseOrder,
  ingredients,
  toPDF,
}) => {
  return (
    <Modal closeModal={() => togglePurchaseOrder(false)}>
      <>
        <div className="mt-6 mx-auto w-full" ref={targetRef}>
          <div>
            <p className="text-xl font-bold">Purchase Order</p>
          </div>
          <p className="font-semibold">Provisions</p>
          <table className="border-2 mt-2 border-black w-full">
            <thead className="border-b-2 border-b-black">
              <tr>
                <th className="border-r border-r-black py-2">Ingredient</th>
                <th className="border-r border-r-black py-2">Quantity</th>
              </tr>
            </thead>

            <tbody>
              {Object.keys(purchaseOrder.provisions).map((ingredient) => {
                return (
                  <tr className="border border-black">
                    <td className="border-r border-r-black font-bold text-lg p-4">
                      {ingredient}
                    </td>
                    <td className="border-r border-r-black font-bold text-lg p-4">{`${purchaseOrder.provisions[
                      ingredient
                    ].toFixed(4)} ${ingredients[ingredient].purchaseUnit}`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <p className="font-semibold mt-6">Consumables</p>
          <table className="border-2 border-black w-full mt-2">
            <thead className="border-b-2 border-b-black">
              <tr>
                <th className="border-r border-r-black py-2">Ingredient</th>
                <th className="border-r border-r-black py-2">Quantity</th>
              </tr>
            </thead>

            <tbody>
              {Object.keys(purchaseOrder.consumables).map((ingredient) => {
                return (
                  <tr className="border border-black">
                    <td className="border-r border-r-black font-bold text-lg p-4">
                      {ingredient}
                    </td>
                    <td className="border-r border-r-black font-bold text-lg p-4">{`${purchaseOrder.consumables[
                      ingredient
                    ].toFixed(4)} ${ingredients[ingredient].purchaseUnit}`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center">
          <button
            className="bg-[#666666] text-white px-4 py-2 rounded-[5px]"
            onClick={() => toPDF()}
          >
            Generate pdf
          </button>
        </div>
      </>
    </Modal>
  );
};

export default PurchaseOrderModal;
