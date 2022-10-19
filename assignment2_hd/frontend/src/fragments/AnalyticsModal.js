import { useEffect } from "react";
import { Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
import { getReactions } from "../data/repository";

export default function AnalyticsModal({
  isGraphicModalVisible,
  toggleGraphicModalVisible,
}) {
  const [reactions, setReactions] = useState([]);

  useEffect(() => {
    const loadReactions = async () => {
      const currentReactions = await getReactions();
      
    }
    
  }, [])

  return (
    <Modal
      size="md"
      show={isGraphicModalVisible}
      onHide={toggleGraphicModalVisible}
      centered
    >
      <ModalHeader closeButton>
        <ModalTitle>Visual Analytics</ModalTitle>
      </ModalHeader>
      <ModalBody></ModalBody>
    </Modal>
  );
}
