import React from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../../constants/ItemTypes";

const DropZone = ({ onDrop }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.STUDENT,
    drop: (item) => {
      onDrop(item.student);
    },
  });

  return <div ref={drop} data-testid="dropzone">Drop here</div>;
};

export default DropZone;
