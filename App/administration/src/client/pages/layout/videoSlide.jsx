import React, { forwardRef, useState, useEffect, useRef } from "react";
import "../css/VideoSlide.css";

const VideoSlide = ({ videos, selectedVideo, handleSelectedVideos }) => {
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
								className="outerContainer"
								key={index}
								style={{
									margin: 10,
									marginBottom: 30,
									width: "30%",
									height: "30%",
								}}
							>
								<div
									style={{
										position: "relative",
									}}
									onClick={() => {
										console.log(`CLICKED ON ${video.name}`);
										handleSelectedVideos(video.name);
									}}
								>
									<video
										src={video.url}
										controls
										type="video/mp4"
										style={{ width: "100%", height: "100%" }}
									/>
									<div
										style={{
											position: "absolute",
											top: 0,
											right: 0,
											width: 20,
											height: 20,
											width: "20px",
											height: "20px",
											backgroundColor:
												selectedVideo && selectedVideo.length > 0
													? selectedVideo.includes(video.name)
														? "green"
														: "blue"
													: "blue",
										}}
									/>
								</div>
								<div>{video.name.split("/")[2].slice(0, -4)}</div>
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
