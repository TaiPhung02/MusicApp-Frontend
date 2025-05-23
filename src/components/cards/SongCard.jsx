import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import PlayPause from "../music/PlayPause";
import { playPause } from "../../redux/features/playerSlice";
import { forwardRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const SongCard = forwardRef(({ song, isPlaying, activeSong, onPlay }, ref) => {
  const dispatch = useDispatch();

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = () => {
    onPlay();
    dispatch(playPause(true));
  };

  return (
    <div
      ref={ref}
      className="flex flex-col w-full sm:w-[220px] p-2 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
      <div className="relative w-full h-44 group">
        <div
          className={`absolute inset-0 z-10 flex justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300 ${
            activeSong?.id === song?.id
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          }`}>
          <PlayPause
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={song}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
          />
        </div>

        <LazyLoadImage
          src={song?.album?.cover_big}
          alt="song_img"
          effect="blur"
          className="w-full h-full object-cover rounded-lg"
          wrapperClassName="w-full h-full"
        />
      </div>

      <div className="mt-3 flex flex-col">
        <p className="font-semibold text-sm sm:text-lg text-white truncate">
          <Link to={`/songs/${song?.id}`}>{song?.title}</Link>
        </p>

        <p className="hover:underline text-xs sm:text-sm truncate text-gray-300 mt-1">
          <Link to={`artists/${song?.artist?.id}`}>{song?.artist?.name}</Link>
        </p>
      </div>
    </div>
  );
});

export default SongCard;
