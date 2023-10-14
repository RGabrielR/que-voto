import { Button, Modal } from "flowbite-react";
const ModalGuess = ({ showModalHint, setShowModalHint, presentData }) => {
  const regex = /(\d)(?=(\d{3})+(?!\d))/g;
  let formatedARSPrize;
  let formatedUSDPrize;
  if (presentData) {
    formatedARSPrize = presentData?.prizeInARS
      .replace(/[^0-9]/g, "")
      .replace(regex, "$1. ");
    if (presentData.prizeInUSD) {
      formatedUSDPrize = presentData?.prizeInUSD
        .replace(/[^0-9]/g, "")
        .replace(regex, "$1. ");
    }
  }

  return (
    <Modal
      show={showModalHint}
      size={"6xl"}
      onClose={() => setShowModalHint(false)}
    >
      <Modal.Header className="pl-12">Pista</Modal.Header>
      <Modal.Body>
        <div className="space-y-6 p-6 ">
          <p className=" leading-relaxed text-gray-500 dark:text-gray-400 text-lg xl:text-2xl">
            El precio esta en{" "}
            {presentData.prizeInUSD ? (
              <span className="text-bold text-green-600">Dólares</span>
            ) : (
              <span className="text-bold text-blue-600">Pesos</span>
            )}
            .
          </p>
          <p className="text-xs xl:text-base leading-relaxed text-gray-500 dark:text-gray-400">
            {Buffer.from(presentData.description?.data)
              .toString("utf8")
              .replace(presentData.prizeInUSD, "XXXXXX")
              .replace(presentData.prizeInARS, "XXXXXX")
              .replace(formatedARSPrize, "XXXXXX")
              .replace(formatedUSDPrize, "XXXXXX")}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setShowModalHint(false)}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalGuess;
