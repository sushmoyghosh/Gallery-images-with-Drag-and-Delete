import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import ImageUploader from "./ImageUploader";
import categoryImg01 from "../Gallery/images/image-1.webp";
import categoryImg02 from "../Gallery/images/image-2.webp";
import categoryImg03 from "../Gallery/images/image-3.webp";
import categoryImg04 from "../Gallery/images/image-4.webp";
import categoryImg05 from "../Gallery/images/image-5.webp";
import categoryImg06 from "../Gallery/images/image-6.webp";
import categoryImg07 from "../Gallery/images/image-7.webp";
import categoryImg08 from "../Gallery/images/image-8.webp";
import categoryImg09 from "../Gallery/images/image-9.webp";
import categoryImg10 from "../Gallery/images/image-10.jpeg";
import categoryImg11 from "../Gallery/images/image-11.jpeg";
import { Container, Row, Col } from 'react-grid-system';

const galleryList = [
  {
    id: 1,
    img: categoryImg01,
  },
  {
    id: 2,
    img: categoryImg02,
  },
  {
    id: 3,
    img: categoryImg03,
  },
  {
    id: 4,
    img: categoryImg04,
  },
  {
    id: 5,
    img: categoryImg05,
  },
  {
    id: 6,
    img: categoryImg06,
  },
  {
    id: 7,
    img: categoryImg07,
  },
  {
    id: 8,
    img: categoryImg08,
  },
  {
    id: 9,
    img: categoryImg09,
  },
  {
    id: 10,
    img: categoryImg10,
  },
  {
    id: 11,
    img: categoryImg11,
  },
];

const Card = ({ src, title, id, index, moveImage, selected, onSelect }) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: "image",
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveImage(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "image",
    item: () => {
      return { id, index };
    },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  });

  const opacity = isDragging ? 0 : 1;

  return (
    <div
      ref={(node) => {
        ref.current = node;
        drop(node);
        drag(node);
      }}
      style={{ opacity }}
      className={`card ${selected ? "selected" : ""}`}
    >
      <div className="Container1">
        <div className="overlay">
          <input type="checkbox" checked={selected} onChange={() => onSelect(id)} />
        </div>
        <img src={src} alt={title} className={`images ${id === 1 ? "big-image" : ""}`} />
      </div>
    </div>
  );
};

function Footer() {
  const [images, setImages] = useState(galleryList);
  const [selectedImages, setSelectedImages] = useState([]);

  const moveImage = React.useCallback((dragIndex, hoverIndex) => {
    setImages((prevCards) => {
      const clonedCards = [...prevCards];
      const removedItem = clonedCards.splice(dragIndex, 1)[0];
      clonedCards.splice(hoverIndex, 0, removedItem);
      return clonedCards;
    });
  }, []); // Add an empty dependency array

  const handleSelectImage = (id) => {
    const updatedSelectedImages = selectedImages.includes(id)
      ? selectedImages.filter((selectedId) => selectedId !== id)
      : [...selectedImages, id];
    setSelectedImages(updatedSelectedImages);
  };

  const handleDeleteImages = () => {
    const remainingImages = images.filter((image) => !selectedImages.includes(image.id));
    setImages(remainingImages);
    setSelectedImages([]);
  };

  const handleImageUpload = (newImage) => {
    const lastImage = images[images.length - 1];
    const newImages = [...images, { id: lastImage.id + 1, img: newImage }];
    setImages(newImages);
    setSelectedImages([lastImage.id + 1]);
  };

  return (
    <div className="container">
      <div className="gallery">
        <Container>
          <Row>
            <Col sm={8}>
              <h3>React Image Gallery with Drag and Delete</h3>
            </Col>
            <Col sm={2}>
              {selectedImages.length > 0 && (
                <>
                  <p>Selected Items: {selectedImages.length}</p>
                </>
              )}
            </Col>
            <Col sm={2}>
              {selectedImages.length > 0 && (
                <>
                  <button className="delete-button" onClick={handleDeleteImages}>
                    Delete
                  </button>
                </>
              )}
            </Col>
          </Row>
        </Container>
      </div>
      <main className="image-grid">
        {images.map((image, index) => (
          <Card
            key={image.id}
            src={image.img}
            title={image.title}
            id={image.id}
            index={index}
            moveImage={moveImage}
            selected={selectedImages.includes(image.id)}
            onSelect={handleSelectImage}
          />
        ))}
        <ImageUploader onImageUpload={handleImageUpload} />
      </main>
    </div>
  );
}

export default Footer;
