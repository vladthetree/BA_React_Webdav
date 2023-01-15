import React, { forwardRef,useEffect,useState,useRef } from "react";
import { Dropdown } from "./utils/components/dropDown";
import "../css/administrator.css"

const Administration = forwardRef((props, ref) => {
    const [size, setSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef({ size: { width: 0, height: 0 } });
    const array = [
      "index 1",
      "index 2",
      "index 3",
      "index 4",
      "index 5",
      "index 6",
      "index 7",
      "index 8",
      "index 9",
      "index 10",
      "index 11",
      "index 12",
      "index 13",
      "index 14",
      "index 15",
      "index 16",
      "index 17",
      "index 18",
      "index 19",
      "index 20",
      ];

    useEffect(() => {
      function handleResize() {
        const newSize = ref.current.getBoundingClientRect();
        if (newSize.width !== size.width || newSize.height !== size.height) {
          setSize(newSize);
        }
      }
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, [ref, size]);

    console.log(size);
    return (
        <div
          ref={ref}
          className="box box_uper_left"
        >
            <div className="container-administration">
                <div>ROW1</div>
                <div className="container-administration-2rd-row" ref={containerRef}>
                  <div>1</div>
                  <Dropdown array={array} sizeDropDownRef={containerRef}/>

                </div>
                <div className="container-administration-3rd-row">
                    <div className="admin-box ad-box-1">ROW3-COL1</div>
                    <div className="admin-box ad-box-2">ROW3-COL2</div>
                    <div className="admin-box ad-box-3">ROW3-COL3</div>
                    <div className="admin-box ad-box-4">ROW3-COL4</div>
                </div>
            </div>
        </div>
    );

});

export default Administration;
