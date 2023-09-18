import { Button, Modal } from "flowbite-react";
import { title, description } from "./ModalResultComponents";
const ModalResult = ({ showModalResult, setShowModalResult, pastData }) => {
  return (
    <Modal
      show={showModalResult}
      size={"6xl"}
      onClose={() => setShowModalResult(false)}
    >
      <Modal.Header className="pl-12 ">
        <span className="text-xl md:text-4xl text-bold -pb-2">
          {" "}
          {title(pastData?.differenceInPercentages)}{" "}
        </span>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6 p-6 ">
          <p className=" leading-relaxed text-gray-500 dark:text-gray-400 text-sm md:text-2xl">
            {description({ pastData })}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setShowModalResult(false)}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalResult;
