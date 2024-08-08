import React from "react";
import MainHeader from "../../../Shared/MainHeader";
import ReactPlayer from "react-player/lazy";
import "../style/video-section.css";
import { FaPlay } from "react-icons/fa";

const VideoSection = () => {
  return (
    <section className="video-section">
      <div className="video">
        <div className="player-wrapper">
          <ReactPlayer
            className="react-player"
            url="https://youtu.be/GWaQiFeQ87g?si=fGK0d-xG3O0YAWEj"
            width="100%"
            height="100%"
            muted="true"
            loop="true"
            playing="true"
          />
        </div>
      </div>
      <div className="container">
        <div className="icon">
          <FaPlay />
        </div>
        <MainHeader header={"Feel the authentic & original taste from us"} />
      </div>
    </section>
  );
};

export default VideoSection;
