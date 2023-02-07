import React, { forwardRef, useState, useEffect, useRef } from "react";
import "../css/VideoSlide.css";

const VideoSlide = ({ videos }) => {
	console.log("INSIDE VIDEOSLIDE");

	return (
		<div style={{ backgroundColor: "green", width: "100%", height: "100%" }}>
			<div
				style={{
					width: "100%",
					height: "100%",
					overflowX: "scroll",
					scrollbarWidth: "auto",
					display: "flex",
					flexWrap: "wrap",
				}}
			>
				{videos !== null ? (
					<>
						{videos.map((video, index) => (
							<div
								key={index}
								style={{
									margin: 10,
									marginBottom: 30,
									width: "30%",
									height: "30%",
									maxWidth: "100%",
									maxHeight: "100%",
								}}
							>
								<video
									src={video.url}
									controls
									type="video/mp4"
									style={{ width: "100%", height: "100%" }}
								/>
								{video.name.split("/")[2].slice(0, -4)}
							</div>
						))}
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								style={{
									margin: 10,
									marginBottom: 30,
									width: "30%",
									height: "30%",
									maxWidth: "100%",
									maxHeight: "100%",
									visibility: "hidden",
								}}
							/>
						))}
					</>
				) : (
					<div>No videos available.</div>
				)}
			</div>
		</div>
	);
};

export default VideoSlide;
