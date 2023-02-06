import React, { forwardRef, useState, useEffect, useRef } from "react";
import "../css/VideoSlide.css";

const VideoSlide = ({videos}) => {
	console.log("INSIDE VIDEOSLIDE");

	return (
		<div className="box videoStyle_box" >
			{videos !== null ? (
				videos.map((video) => (
					<div className="box videoStyle_box" key={video.name}>
						<video src={video.url} controls type="video/mp4" />
					</div>
				))
			) : (
				<div>No videos to display.</div>
			)}
		</div>
	);
};

export default VideoSlide;
