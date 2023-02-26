import React, { forwardRef, useState, useEffect, useRef } from "react";
import "../css/videoSlide.css"

import { Buffer } from "buffer";

// const buffer = Buffer.from(newFile.buffer);
//       if (newFile.name.endsWith(".json")) {
//         const decoder = new TextDecoder('utf-8');
//         const jsonString = decoder.decode(buffer);
//         const jsonObject = JSON.parse(jsonString);

const VideoSlide = ({ videos, selectedVideo, handleSelectedVideos, videoArrayRef }) => {




	return (
		<div className="videoSlide-container">
			{videoArrayRef ? (
				<div className="videoSlide-inner-container">
					{videos.map((video, index) => (
						<div className="video-Container" key={index}>
							<div className="video-uper">
								{/* <div className="video-marker">
									<div
										onClick={handleSelectedVideos(video.name)}
										style={{
											position: "absolute",
											top: 0,
											right: 0,
											width: "20px",
											height: "20px",
											backgroundColor:
												selectedVideo && selectedVideo.length > 0
													? selectedVideo.includes(video.name)
														? "green"
														: "blue"
													: "blue",
										}}
									></div>
								</div>
								<div className="video-style">
									<video src={video} controls type="video/mp4" />
								</div> */}
							</div>
							<div className="video-bottom">{"SAMPLE"}</div>
						</div>
					))}
				</div>
			) : (
				<div>No videos available.</div>
			)}
		</div>
	);
};

export default VideoSlide;