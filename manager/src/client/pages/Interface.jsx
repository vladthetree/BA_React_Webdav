import React, { useRef, useEffect } from "react";
import "../pages/css/Interface.css";
import CurrentVideo from "./layout/current_Video.jsx";
import Administration from "./layout/administration.jsx";
import VideoSlide from "./layout/videoSlide";

const Interface = () => {
  const uper_leftRef = useRef({ size: { width: 0, height: 0 } });
  const uper_rightRef = useRef({ size: { width: 0, height: 0 } });
  const buttomRef = useRef({ size: { width: 0, height: 0 } });

  useEffect(() => {
    function handleResize() {
      uper_leftRef.current.size = uper_leftRef.current.getBoundingClientRect();
      uper_rightRef.current.size = uper_rightRef.current.getBoundingClientRect();
      buttomRef.current.size = buttomRef.current.getBoundingClientRect();
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [uper_leftRef,uper_rightRef,buttomRef]);

console.log("LEFT")
  console.log(uper_leftRef)
  console.log("RIGHT")
  console.log(uper_rightRef)


  return (
    <div style={{width: "100vw",height: "100vh",display: "grid",gridTemplateRows: "1fr 1fr"}}>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr" }}>
        <Administration ref={uper_leftRef} />
        <CurrentVideo ref={uper_rightRef} />
      </div>
      <VideoSlide ref={buttomRef}/>
    </div>
  );
};

export default Interface;
