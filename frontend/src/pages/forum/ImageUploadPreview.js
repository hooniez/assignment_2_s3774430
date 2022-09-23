import { Offcanvas, Image } from "react-bootstrap";
import styles from "./ImageUploadPreview.module.css";
import { X, XLg } from "react-bootstrap-icons";

export default function ImageUploadPreview({
  isImageUploadPreviewVisible,
  imageUploadPreviewToggler,
  imageRemoveHandler,
  imgSrc,
}) {
  return (
    <Offcanvas
      show={isImageUploadPreviewVisible}
      onHide={imageUploadPreviewToggler}
      placement="bottom"
      className={styles.offcanvas}
      backdropClassName={styles.offcanvasBackdrop}
    >
      <Offcanvas.Header className="d-flex justify-content-center">
        <div className={styles.offcanvasHeaderContainer}>
          <Offcanvas.Title>Preview</Offcanvas.Title>
          <XLg
            size={20}
            role="button"
            onClick={imageUploadPreviewToggler}
          ></XLg>
        </div>
      </Offcanvas.Header>
      <Offcanvas.Body className="pt-0 d-flex justify-content-center">
        <div className={`${styles.offcanvasImageContainer}`}>
          <X
            className={styles.x}
            size={36}
            role="button"
            onClick={imageRemoveHandler}
          ></X>
          <Image src={imgSrc} className={styles.offcanvasImage} fluid={true} />
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
